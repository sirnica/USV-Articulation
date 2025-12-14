import { drizzle } from "drizzle-orm/mysql2";
import { courses, institutions } from "./drizzle/schema.ts";
import { eq, ne } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

async function clearCCCourses() {
  // Get USV institution ID
  const usvResult = await db.select().from(institutions).where(eq(institutions.name, "University of Silicon Valley")).limit(1);
  const usvId = usvResult[0]?.id;
  
  if (usvId) {
    // Delete all courses that are NOT from USV
    await db.delete(courses).where(ne(courses.institutionId, usvId));
    console.log("✅ Deleted all community college courses");
    
    // Count remaining courses
    const remaining = await db.select().from(courses);
    console.log(`Remaining courses (USV only): ${remaining.length}`);
  } else {
    console.log("❌ USV not found");
  }
}

clearCCCourses()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
