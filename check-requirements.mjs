import { drizzle } from "drizzle-orm/mysql2";
import { degreeRequirements, degreePrograms, courses } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

console.log("Checking degree requirements...");

const requirements = await db.select().from(degreeRequirements).limit(10);
console.log(`\nDegree requirements count: ${requirements.length}`);

if (requirements.length > 0) {
  console.log("\nSample requirements:", JSON.stringify(requirements.slice(0, 3), null, 2));
} else {
  console.log("\n⚠️  No degree requirements found in database!");
  console.log("This is why the transfer pathway is empty.");
}

const programs = await db.select().from(degreePrograms).limit(5);
console.log(`\nDegree programs count: ${programs.length}`);

const usvCourses = await db.select().from(courses).limit(5);
console.log(`\nUSV courses count: ${usvCourses.length}`);

process.exit(0);
