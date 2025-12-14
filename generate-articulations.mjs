import { drizzle } from "drizzle-orm/mysql2";
import { courses, articulationMappings, institutions } from "./drizzle/schema.ts";
import { eq, and, ne } from "drizzle-orm";
import { invokeLLM } from "./server/_core/llm.ts";

const db = drizzle(process.env.DATABASE_URL);

// Get USV institution ID
const usvResult = await db.select().from(institutions).where(eq(institutions.name, "University of Silicon Valley")).limit(1);
const usvId = usvResult[0]?.id;

if (!usvId) {
  console.error("❌ USV institution not found");
  process.exit(1);
}

// Get all USV courses
const usvCourses = await db.select().from(courses).where(eq(courses.institutionId, usvId));
console.log(`Found ${usvCourses.length} USV courses`);

// Get all community college courses
const ccCourses = await db.select().from(courses).where(ne(courses.institutionId, usvId));
console.log(`Found ${ccCourses.length} community college courses`);

// Function to analyze course similarity using LLM
async function analyzeCourseEquivalency(ccCourse, usvCourse) {
  const prompt = `Analyze if these two courses are equivalent or similar enough for transfer credit.

Community College Course:
- Code: ${ccCourse.courseCode}
- Title: ${ccCourse.title}
- Units: ${ccCourse.units}
- Description: ${ccCourse.description || "No description"}

USV Course:
- Code: ${usvCourse.courseCode}
- Title: ${usvCourse.title}
- Units: ${usvCourse.units}
- Description: ${usvCourse.description || "No description"}

Determine:
1. Are these courses equivalent? (direct, partial, elective, or none)
2. Similarity score (0-100)
3. Brief justification

Respond in JSON format:
{
  "equivalencyType": "direct" | "partial" | "elective" | "none",
  "similarityScore": 0-100,
  "notes": "brief explanation"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an academic advisor analyzing course equivalencies for transfer credit." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "course_equivalency",
          strict: true,
          schema: {
            type: "object",
            properties: {
              equivalencyType: {
                type: "string",
                enum: ["direct", "partial", "elective", "none"]
              },
              similarityScore: {
                type: "number",
                description: "Similarity score from 0 to 100"
              },
              notes: {
                type: "string",
                description: "Brief explanation of the equivalency determination"
              }
            },
            required: ["equivalencyType", "similarityScore", "notes"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (error) {
    console.error(`Error analyzing ${ccCourse.courseCode} vs ${usvCourse.courseCode}:`, error.message);
  }
  
  return null;
}

// Generate articulation mappings
async function generateArticulations() {
  let totalMappings = 0;
  let directMappings = 0;
  let partialMappings = 0;
  let electiveMappings = 0;
  
  console.log("\n🔄 Starting articulation mapping generation...\n");
  
  // For each community college course, find potential USV matches
  for (const ccCourse of ccCourses) {
    // Find potential USV course matches based on course code patterns
    const potentialMatches = usvCourses.filter(usvCourse => {
      // Match by subject area (first part of course code)
      const ccSubject = ccCourse.courseCode.split(/\s+/)[0];
      const usvSubject = usvCourse.courseCode.split(/\s+/)[0];
      
      // Business courses
      if ((ccSubject === "BUS" || ccSubject === "BUSI" || ccSubject === "ACCT" || ccSubject === "ECON") && 
          (usvSubject === "BUS" || usvSubject === "ACCT" || usvSubject === "ECON")) {
        return true;
      }
      
      // Computer Science courses
      if ((ccSubject === "CS" || ccSubject === "C" || ccSubject === "CIS" || ccSubject === "CSCI") && 
          (usvSubject === "CS" || usvSubject === "CSCI" || usvSubject === "CIS")) {
        return true;
      }
      
      // English/Writing courses
      if ((ccSubject === "ENGL" || ccSubject === "EWRT") && usvSubject === "ENG") {
        return true;
      }
      
      // Communication courses
      if (ccSubject === "COMM" && usvSubject === "ENG") {
        return true;
      }
      
      // Math courses
      if (ccSubject === "MATH" && usvSubject === "MATH") {
        return true;
      }
      
      // Science courses
      if ((ccSubject === "BIOL" || ccSubject === "CHEM" || ccSubject === "PHYS") && 
          (usvSubject === "BIOL" || usvSubject === "CHEM" || usvSubject === "PHYS")) {
        return true;
      }
      
      // Social Science courses
      if ((ccSubject === "PSYC" || ccSubject === "SOC" || ccSubject === "HIST") && 
          (usvSubject === "PSYC" || usvSubject === "SOC" || usvSubject === "HIST")) {
        return true;
      }
      
      // Arts courses
      if ((ccSubject === "ART" || ccSubject === "ARTS" || ccSubject === "GID" || ccSubject === "PHOT" || ccSubject === "PHTG" || ccSubject === "F/TV") && 
          (usvSubject === "ART" || usvSubject === "ARTS" || usvSubject === "GID")) {
        return true;
      }
      
      // Music courses
      if ((ccSubject === "MUS" || ccSubject === "MUSI") && usvSubject === "MUS") {
        return true;
      }
      
      return false;
    });
    
    if (potentialMatches.length > 0) {
      console.log(`\n📚 Analyzing ${ccCourse.courseCode} - ${ccCourse.title}`);
      console.log(`   Found ${potentialMatches.length} potential USV matches`);
      
      // Analyze each potential match
      for (const usvCourse of potentialMatches) {
        const analysis = await analyzeCourseEquivalency(ccCourse, usvCourse);
        
        if (analysis && analysis.equivalencyType !== "none" && analysis.similarityScore >= 50) {
          // Check if mapping already exists
          const existing = await db.select().from(articulationMappings)
            .where(and(
              eq(articulationMappings.ccCourseId, ccCourse.id),
              eq(articulationMappings.usvCourseId, usvCourse.id)
            ))
            .limit(1);
          
          if (existing.length === 0) {
            // Create the articulation mapping
            await db.insert(articulationMappings).values({
              ccCourseId: ccCourse.id,
              usvCourseId: usvCourse.id,
              equivalencyType: analysis.equivalencyType,
              similarityScore: Math.round(analysis.similarityScore),
              notes: analysis.notes,
              approvalStatus: analysis.similarityScore >= 80 ? "approved" : "pending",
            });
            
            totalMappings++;
            if (analysis.equivalencyType === "direct") directMappings++;
            else if (analysis.equivalencyType === "partial") partialMappings++;
            else if (analysis.equivalencyType === "elective") electiveMappings++;
            
            console.log(`   ✓ ${analysis.equivalencyType.toUpperCase()} → ${usvCourse.courseCode} (score: ${analysis.similarityScore})`);
          }
        }
      }
    }
  }
  
  console.log(`\n\n✅ Articulation mapping generation complete!`);
  console.log(`\nSummary:`);
  console.log(`  Total mappings created: ${totalMappings}`);
  console.log(`  - Direct equivalencies: ${directMappings}`);
  console.log(`  - Partial equivalencies: ${partialMappings}`);
  console.log(`  - Elective credit: ${electiveMappings}`);
}

generateArticulations()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
