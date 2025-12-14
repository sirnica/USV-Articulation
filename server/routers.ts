import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Institution management
  institutions: router({
    list: publicProcedure
      .input(z.object({ activeOnly: z.boolean().optional().default(true) }))
      .query(async ({ input }) => {
        return await db.getInstitutions(input.activeOnly);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        shortName: z.string().optional(),
        type: z.enum(["university", "community_college"]),
        website: z.string().optional(),
        catalogUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createInstitution(input);
      }),
  }),

  // Degree program management
  degreePrograms: router({
    list: publicProcedure
      .input(z.object({ activeOnly: z.boolean().optional().default(true) }))
      .query(async ({ input }) => {
        return await db.getDegreePrograms(input.activeOnly);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getDegreeProgramById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        code: z.string(),
        degreeType: z.string(),
        department: z.string().optional(),
        totalUnitsRequired: z.number(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createDegreeProgram(input);
      }),
    
    getRequirements: publicProcedure
      .input(z.object({ degreeProgramId: z.number() }))
      .query(async ({ input }) => {
        return await db.getDegreeRequirements(input.degreeProgramId);
      }),
  }),

  // Course management
  courses: router({
    list: publicProcedure
      .input(z.object({ institutionId: z.number() }))
      .query(async ({ input }) => {
        return await db.getCoursesByInstitution(input.institutionId);
      }),
    
    search: publicProcedure
      .input(z.object({
        searchTerm: z.string(),
        institutionId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.searchCourses(input.searchTerm, input.institutionId);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCourseById(input.id);
      }),
    
    create: adminProcedure
      .input(z.object({
        institutionId: z.number(),
        courseCode: z.string(),
        title: z.string(),
        units: z.number(),
        description: z.string().optional(),
        prerequisites: z.string().optional(),
        learningOutcomes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCourse(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        courseCode: z.string().optional(),
        title: z.string().optional(),
        units: z.number().optional(),
        description: z.string().optional(),
        prerequisites: z.string().optional(),
        learningOutcomes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateCourse(id, data);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteCourse(input.id);
        return { success: true };
      }),
  }),

  // GE Areas
  geAreas: router({
    list: publicProcedure.query(async () => {
      return await db.getGeAreas();
    }),
    
    create: adminProcedure
      .input(z.object({
        code: z.string(),
        label: z.string(),
        description: z.string().optional(),
        transferable: z.boolean().default(true),
        color: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createGeArea(input);
      }),
  }),

  // Articulation mappings
  articulations: router({
    list: publicProcedure
      .input(z.object({
        status: z.string().optional(),
        ccCourseId: z.number().optional(),
        usvCourseId: z.number().optional(),
        institutionId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getArticulationMappings(input);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getArticulationMappingById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        ccCourseId: z.number(),
        usvCourseId: z.number(),
        equivalencyType: z.enum(["direct", "elective", "partial", "none"]),
        similarityScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "pending", "approved", "rejected"]).default("draft"),
      }))
      .mutation(async ({ input, ctx }) => {
        return await db.createArticulationMapping({
          ...input,
          createdBy: ctx.user.id,
        });
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        equivalencyType: z.enum(["direct", "elective", "partial", "none"]).optional(),
        similarityScore: z.number().min(0).max(100).optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        
        // If status is being changed to approved, add review info
        if (data.status === 'approved') {
          await db.updateArticulationMapping(id, {
            ...data,
            reviewedBy: ctx.user.id,
            reviewedAt: new Date(),
          });
        } else {
          await db.updateArticulationMapping(id, data);
        }
        
        return { success: true };
      }),
    
    // LLM-powered course analysis
    analyzeSimilarity: protectedProcedure
      .input(z.object({
        ccCourseId: z.number(),
        usvCourseId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const ccCourse = await db.getCourseById(input.ccCourseId);
        const usvCourse = await db.getCourseById(input.usvCourseId);
        
        if (!ccCourse || !usvCourse) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Course not found' });
        }
        
        const prompt = `Analyze the similarity between these two courses and provide a similarity score (0-100) and equivalency recommendation.

Community College Course:
Code: ${ccCourse.courseCode}
Title: ${ccCourse.title}
Units: ${ccCourse.units}
Description: ${ccCourse.description || 'N/A'}
Learning Outcomes: ${ccCourse.learningOutcomes || 'N/A'}

USV Course:
Code: ${usvCourse.courseCode}
Title: ${usvCourse.title}
Units: ${usvCourse.units}
Description: ${usvCourse.description || 'N/A'}
Learning Outcomes: ${usvCourse.learningOutcomes || 'N/A'}

Provide your analysis in the following JSON format:
{
  "similarityScore": <number 0-100>,
  "equivalencyType": "<direct|elective|partial|none>",
  "reasoning": "<brief explanation>",
  "recommendations": "<any recommendations for articulation>"
}`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an academic articulation expert analyzing course equivalencies." },
            { role: "user", content: prompt }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "course_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  similarityScore: { type: "number", description: "Similarity score from 0 to 100" },
                  equivalencyType: { 
                    type: "string", 
                    enum: ["direct", "elective", "partial", "none"],
                    description: "Type of equivalency" 
                  },
                  reasoning: { type: "string", description: "Brief explanation of the analysis" },
                  recommendations: { type: "string", description: "Recommendations for articulation" }
                },
                required: ["similarityScore", "equivalencyType", "reasoning", "recommendations"],
                additionalProperties: false
              }
            }
          }
        });
        
        const content = response.choices[0].message.content;
        const analysis = JSON.parse(typeof content === 'string' ? content : '');
        return analysis;
      }),
  }),

  // Transfer pathway calculator
  transfer: router({
    getPathway: publicProcedure
      .input(z.object({
        ccInstitutionId: z.number(),
        degreeProgramId: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getTransferPathway(input.ccInstitutionId, input.degreeProgramId);
      }),
    
    calculateCredits: publicProcedure
      .input(z.object({
        ccInstitutionId: z.number(),
        degreeProgramId: z.number(),
        completedCourseIds: z.array(z.number()),
      }))
      .query(async ({ input }) => {
        const pathway = await db.getTransferPathway(input.ccInstitutionId, input.degreeProgramId);
        
        let totalTransferableUnits = 0;
        let fulfilledRequirements = 0;
        const matchedCourses = [];
        
        for (const item of pathway) {
          for (const mapping of item.ccMappings) {
            if (mapping.ccCourse && input.completedCourseIds.includes(mapping.ccCourse.id)) {
              totalTransferableUnits += mapping.ccCourse.units;
              fulfilledRequirements++;
              matchedCourses.push({
                ccCourse: mapping.ccCourse,
                usvCourse: item.usvCourse,
                mapping: mapping.mapping
              });
              break;
            }
          }
        }
        
        return {
          totalTransferableUnits,
          fulfilledRequirements,
          totalRequirements: pathway.length,
          matchedCourses
        };
      }),
  }),

  // Statistics
  stats: router({
    dashboard: publicProcedure.query(async () => {
      return await db.getStatistics();
    }),
  }),

  // Import/Export
  import: router({
    history: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ input }) => {
        return await db.getImportHistory(input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
