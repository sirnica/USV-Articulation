import { drizzle } from "drizzle-orm/mysql2";
import { courses } from "./drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function checkCourses() {
  const allCourses = await db.select().from(courses);
  console.log("Total courses:", allCourses.length);
  
  // Group by institution
  const foothill = await db.select().from(courses).where(eq(courses.institutionId, 2));
  const deanza = await db.select().from(courses).where(eq(courses.institutionId, 3));
  const sjcc = await db.select().from(courses).where(eq(courses.institutionId, 4));
  const evergreen = await db.select().from(courses).where(eq(courses.institutionId, 5));
  const sierra = await db.select().from(courses).where(eq(courses.institutionId, 6));
  
  console.log("\nFoothill:", foothill.length, "courses");
  console.log("Codes:", foothill.map(c => c.courseCode).join(", "));
  
  console.log("\nDe Anza:", deanza.length, "courses");
  console.log("Codes:", deanza.map(c => c.courseCode).join(", "));
  
  console.log("\nSJCC:", sjcc.length, "courses");
  console.log("Codes:", sjcc.map(c => c.courseCode).join(", "));
  
  console.log("\nEvergreen:", evergreen.length, "courses");
  console.log("Codes:", evergreen.map(c => c.courseCode).join(", "));
  
  console.log("\nSierra:", sierra.length, "courses");
  console.log("Codes:", sierra.map(c => c.courseCode).join(", "));
}

checkCourses()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
