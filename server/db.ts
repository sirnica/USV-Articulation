import { eq, and, or, desc, asc, sql, like, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  institutions, 
  InsertInstitution,
  degreePrograms,
  InsertDegreeProgram,
  courses,
  InsertCourse,
  geAreas,
  InsertGeArea,
  degreeRequirements,
  InsertDegreeRequirement,
  articulationMappings,
  InsertArticulationMapping,
  geMappings,
  InsertGeMapping,
  importHistory,
  InsertImportHistory,
  Institution,
  DegreeProgram,
  Course,
  GeArea,
  DegreeRequirement,
  ArticulationMapping,
  GeMapping
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Institution helpers
export async function createInstitution(data: InsertInstitution) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(institutions).values(data);
  return result;
}

export async function getInstitutions(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  const query = activeOnly 
    ? db.select().from(institutions).where(eq(institutions.active, true))
    : db.select().from(institutions);
  
  return await query;
}

export async function getInstitutionById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(institutions).where(eq(institutions.id, id)).limit(1);
  return result[0] || null;
}

// Degree Program helpers
export async function createDegreeProgram(data: InsertDegreeProgram) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(degreePrograms).values(data);
  return result;
}

export async function getDegreePrograms(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) return [];
  
  const query = activeOnly 
    ? db.select().from(degreePrograms).where(eq(degreePrograms.active, true))
    : db.select().from(degreePrograms);
  
  return await query;
}

export async function getDegreeProgramById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(degreePrograms).where(eq(degreePrograms.id, id)).limit(1);
  return result[0] || null;
}

// Course helpers
export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(courses).values(data);
  return result;
}

export async function getCoursesByInstitution(institutionId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(courses)
    .where(and(eq(courses.institutionId, institutionId), eq(courses.active, true)))
    .orderBy(asc(courses.courseCode));
}

export async function searchCourses(searchTerm: string, institutionId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [
    or(
      like(courses.courseCode, `%${searchTerm}%`),
      like(courses.title, `%${searchTerm}%`),
      like(courses.description, `%${searchTerm}%`)
    )
  ];
  
  if (institutionId) {
    conditions.push(eq(courses.institutionId, institutionId));
  }
  
  return await db.select().from(courses)
    .where(and(...conditions))
    .limit(50);
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0] || null;
}

export async function updateCourse(id: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courses).set(data).where(eq(courses.id, id));
}

export async function deleteCourse(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courses).set({ active: false }).where(eq(courses.id, id));
}

// GE Area helpers
export async function createGeArea(data: InsertGeArea) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(geAreas).values(data);
  return result;
}

export async function getGeAreas() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(geAreas);
}

// Degree Requirement helpers
export async function createDegreeRequirement(data: InsertDegreeRequirement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(degreeRequirements).values(data);
  return result;
}

export async function getDegreeRequirements(degreeProgramId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(degreeRequirements)
    .where(eq(degreeRequirements.degreeProgramId, degreeProgramId));
}

// Articulation Mapping helpers
export async function createArticulationMapping(data: InsertArticulationMapping) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(articulationMappings).values(data);
  return result;
}

export async function getArticulationMappings(filters?: {
  status?: string;
  ccCourseId?: number;
  usvCourseId?: number;
  institutionId?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select({
    mapping: articulationMappings,
    ccCourse: courses,
    usvCourse: courses,
    institution: institutions
  })
  .from(articulationMappings)
  .leftJoin(courses, eq(articulationMappings.ccCourseId, courses.id))
  .leftJoin(institutions, eq(courses.institutionId, institutions.id));
  
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(articulationMappings.status, filters.status as any));
  }
  if (filters?.ccCourseId) {
    conditions.push(eq(articulationMappings.ccCourseId, filters.ccCourseId));
  }
  if (filters?.usvCourseId) {
    conditions.push(eq(articulationMappings.usvCourseId, filters.usvCourseId));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query.orderBy(desc(articulationMappings.createdAt));
}

export async function updateArticulationMapping(id: number, data: Partial<InsertArticulationMapping>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(articulationMappings).set(data).where(eq(articulationMappings.id, id));
}

export async function getArticulationMappingById(id: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(articulationMappings)
    .where(eq(articulationMappings.id, id))
    .limit(1);
  return result[0] || null;
}

// GE Mapping helpers
export async function createGeMapping(data: InsertGeMapping) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(geMappings).values(data);
  return result;
}

export async function getGeMappingsByCourse(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select({
    mapping: geMappings,
    geArea: geAreas
  })
  .from(geMappings)
  .leftJoin(geAreas, eq(geMappings.geAreaId, geAreas.id))
  .where(eq(geMappings.courseId, courseId));
}

// Import History helpers
export async function createImportHistory(data: InsertImportHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(importHistory).values(data);
  return result;
}

export async function getImportHistory(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(importHistory)
    .orderBy(desc(importHistory.createdAt))
    .limit(limit);
}

// Complex queries for transfer credit calculation
export async function getTransferPathway(ccInstitutionId: number, degreeProgramId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Get all requirements for the degree program
  const requirements = await db.select({
    requirement: degreeRequirements,
    course: courses
  })
  .from(degreeRequirements)
  .leftJoin(courses, eq(degreeRequirements.courseId, courses.id))
  .where(eq(degreeRequirements.degreeProgramId, degreeProgramId));
  
  // For each requirement, find articulation mappings from the CC
  const pathway = [];
  for (const req of requirements) {
    if (!req.course) continue;
    
    const mappings = await db.select({
      mapping: articulationMappings,
      ccCourse: courses
    })
    .from(articulationMappings)
    .leftJoin(courses, eq(articulationMappings.ccCourseId, courses.id))
    .where(
      and(
        eq(articulationMappings.usvCourseId, req.course.id),
        eq(articulationMappings.status, 'approved'),
        eq(courses.institutionId, ccInstitutionId)
      )
    );
    
    pathway.push({
      usvCourse: req.course,
      requirementType: req.requirement.requirementType,
      ccMappings: mappings
    });
  }
  
  return pathway;
}

export async function getStatistics() {
  const db = await getDb();
  if (!db) return null;
  
  const totalMappings = await db.select({ count: sql<number>`count(*)` })
    .from(articulationMappings);
  
  const approvedMappings = await db.select({ count: sql<number>`count(*)` })
    .from(articulationMappings)
    .where(eq(articulationMappings.status, 'approved'));
  
  const directEquivalencies = await db.select({ count: sql<number>`count(*)` })
    .from(articulationMappings)
    .where(eq(articulationMappings.equivalencyType, 'direct'));
  
  const totalCourses = await db.select({ count: sql<number>`count(*)` })
    .from(courses)
    .where(eq(courses.active, true));
  
  return {
    totalMappings: totalMappings[0]?.count || 0,
    approvedMappings: approvedMappings[0]?.count || 0,
    directEquivalencies: directEquivalencies[0]?.count || 0,
    totalCourses: totalCourses[0]?.count || 0
  };
}
