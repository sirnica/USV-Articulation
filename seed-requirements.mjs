import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { 
  degreePrograms,
  courses,
  degreeRequirements,
  institutions
} from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seedRequirements() {
  console.log("Clearing existing degree requirements...");
  await db.delete(degreeRequirements);
  
  console.log("Populating degree requirements...");

  // Get USV institution
  const [usv] = await db.select().from(institutions).where(eq(institutions.shortName, "USV")).limit(1);
  if (!usv) {
    console.error("USV institution not found!");
    return;
  }

  // Get all degree programs
  const programs = await db.select().from(degreePrograms);
  console.log(`Found ${programs.length} degree programs`);

  // Get all USV courses
  const usvCourses = await db.select().from(courses).where(eq(courses.institutionId, usv.id));
  console.log(`Found ${usvCourses.length} USV courses`);

  // Create a map of course codes to IDs
  const courseMap = {};
  usvCourses.forEach(course => {
    courseMap[course.courseCode] = course.id;
  });

  // Common GE requirements for all programs
  const commonGERequirements = [
    { code: "USV101", type: "general_education" },
    { code: "ENG101", type: "general_education" },
    { code: "ENG251", type: "general_education" },
    { code: "ENG302", type: "general_education" },
    { code: "MATH113", type: "general_education" },
  ];

  // Program-specific requirements
  const programRequirements = {
    "BSBA": [ // Business Administration
      { code: "BUS121", type: "major" },
      { code: "BUS141", type: "major" },
      { code: "BUS250", type: "major" },
      { code: "BUS125", type: "major" },
      { code: "BUS246", type: "major" },
    ],
    "SD": [ // Software Development
      { code: "CS101", type: "major" },
      { code: "CS201", type: "major" },
    ],
    "GD": [ // Game Design
      { code: "GAM101", type: "major" },
      { code: "GAM201", type: "major" },
    ],
    "GA": [ // Game Art
      { code: "GAM101", type: "major" },
    ],
    "GE": [ // Game Engineering
      { code: "GAM201", type: "major" },
      { code: "CS101", type: "major" },
    ],
    "DAT": [ // Digital Audio Technology
      { code: "DAT101", type: "major" },
    ],
    "DAA": [ // Digital Art and Animation
      { code: "GAM101", type: "elective" },
    ],
  };

  let totalRequirements = 0;

  // Add requirements for each program
  for (const program of programs) {
    console.log(`\nAdding requirements for ${program.name} (${program.code})...`);
    
    // Add common GE requirements
    for (const req of commonGERequirements) {
      const courseId = courseMap[req.code];
      if (courseId) {
        await db.insert(degreeRequirements).values({
          degreeProgramId: program.id,
          courseId: courseId,
          requirementType: req.type,
          unitsRequired: 4,
        });
        totalRequirements++;
      }
    }

    // Add program-specific requirements
    const specificReqs = programRequirements[program.code] || [];
    for (const req of specificReqs) {
      const courseId = courseMap[req.code];
      if (courseId) {
        await db.insert(degreeRequirements).values({
          degreeProgramId: program.id,
          courseId: courseId,
          requirementType: req.type,
          unitsRequired: 4,
        });
        totalRequirements++;
      }
    }
    
    console.log(`  Added ${commonGERequirements.length + specificReqs.length} requirements`);
  }

  console.log(`\n✅ Successfully added ${totalRequirements} degree requirements!`);
}

seedRequirements()
  .then(() => {
    console.log("\nSeeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
