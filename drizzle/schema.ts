import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, decimal, index, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Educational institutions (USV + Community Colleges)
 */
export const institutions = mysqlTable("institutions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("shortName", { length: 100 }),
  type: mysqlEnum("type", ["university", "community_college"]).notNull(),
  website: varchar("website", { length: 500 }),
  catalogUrl: varchar("catalogUrl", { length: 500 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  nameIdx: index("name_idx").on(table.name),
}));

export type Institution = typeof institutions.$inferSelect;
export type InsertInstitution = typeof institutions.$inferInsert;

/**
 * Degree programs offered by USV
 */
export const degreePrograms = mysqlTable("degreePrograms", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  degreeType: varchar("degreeType", { length: 100 }).notNull(), // "Bachelor of Science", "Bachelor of Arts"
  department: varchar("department", { length: 255 }),
  totalUnitsRequired: int("totalUnitsRequired").notNull(),
  description: text("description"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  codeIdx: index("code_idx").on(table.code),
}));

export type DegreeProgram = typeof degreePrograms.$inferSelect;
export type InsertDegreeProgram = typeof degreePrograms.$inferInsert;

/**
 * Courses from all institutions
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  institutionId: int("institutionId").notNull(),
  courseCode: varchar("courseCode", { length: 50 }).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  units: int("units").notNull(), // Store as integer (e.g., 3 units = 3, 4.5 units = 5)
  description: text("description"),
  prerequisites: text("prerequisites"),
  learningOutcomes: text("learningOutcomes"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  institutionCourseIdx: uniqueIndex("institution_course_idx").on(table.institutionId, table.courseCode),
  courseCodeIdx: index("course_code_idx").on(table.courseCode),
}));

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * General Education areas
 */
export const geAreas = mysqlTable("geAreas", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  transferable: boolean("transferable").default(true).notNull(),
  color: varchar("color", { length: 100 }), // Tailwind color class
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeArea = typeof geAreas.$inferSelect;
export type InsertGeArea = typeof geAreas.$inferInsert;

/**
 * Degree program requirements (courses required for each degree)
 */
export const degreeRequirements = mysqlTable("degreeRequirements", {
  id: int("id").autoincrement().primaryKey(),
  degreeProgramId: int("degreeProgramId").notNull(),
  courseId: int("courseId").notNull(),
  requirementType: mysqlEnum("requirementType", ["core", "major", "elective", "general_education"]).notNull(),
  geAreaId: int("geAreaId"), // Only for general_education type
  required: boolean("required").default(true).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  degreeCourseIdx: uniqueIndex("degree_course_idx").on(table.degreeProgramId, table.courseId),
  degreeIdx: index("degree_idx").on(table.degreeProgramId),
}));

export type DegreeRequirement = typeof degreeRequirements.$inferSelect;
export type InsertDegreeRequirement = typeof degreeRequirements.$inferInsert;

/**
 * Articulation mappings between community college courses and USV courses
 */
export const articulationMappings = mysqlTable("articulationMappings", {
  id: int("id").autoincrement().primaryKey(),
  ccCourseId: int("ccCourseId").notNull(), // Community college course
  usvCourseId: int("usvCourseId").notNull(), // USV course
  equivalencyType: mysqlEnum("equivalencyType", ["direct", "elective", "partial", "none"]).notNull(),
  similarityScore: int("similarityScore"), // 0-100
  notes: text("notes"),
  status: mysqlEnum("status", ["draft", "pending", "approved", "rejected"]).default("draft").notNull(),
  reviewedBy: int("reviewedBy"), // User ID
  reviewedAt: timestamp("reviewedAt"),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  ccUsvIdx: uniqueIndex("cc_usv_idx").on(table.ccCourseId, table.usvCourseId),
  statusIdx: index("status_idx").on(table.status),
  ccCourseIdx: index("cc_course_idx").on(table.ccCourseId),
  usvCourseIdx: index("usv_course_idx").on(table.usvCourseId),
}));

export type ArticulationMapping = typeof articulationMappings.$inferSelect;
export type InsertArticulationMapping = typeof articulationMappings.$inferInsert;

/**
 * GE course mappings (which courses satisfy which GE areas)
 */
export const geMappings = mysqlTable("geMappings", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  geAreaId: int("geAreaId").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  courseGeIdx: uniqueIndex("course_ge_idx").on(table.courseId, table.geAreaId),
}));

export type GeMapping = typeof geMappings.$inferSelect;
export type InsertGeMapping = typeof geMappings.$inferInsert;

/**
 * Import history for tracking CSV/PDF imports
 */
export const importHistory = mysqlTable("importHistory", {
  id: int("id").autoincrement().primaryKey(),
  importType: mysqlEnum("importType", ["csv_courses", "csv_mappings", "pdf_catalog"]).notNull(),
  fileName: varchar("fileName", { length: 500 }),
  recordsProcessed: int("recordsProcessed").default(0),
  recordsSuccess: int("recordsSuccess").default(0),
  recordsError: int("recordsError").default(0),
  errorLog: text("errorLog"),
  importedBy: int("importedBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ImportHistory = typeof importHistory.$inferSelect;
export type InsertImportHistory = typeof importHistory.$inferInsert;
