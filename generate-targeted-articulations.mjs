import { drizzle } from "drizzle-orm/mysql2";
import { courses, articulationMappings, institutions, degreeRequirements } from "./drizzle/schema.ts";
import { eq, and, ne, inArray } from "drizzle-orm";

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

// Predefined articulation mappings based on common course equivalencies
const articulationRules = [
  // English Composition
  { ccPattern: /^(ENGL|EWRT)\s*1A$/i, usvCode: "ENG101", type: "direct", score: 95, notes: "Standard college composition course" },
  { ccPattern: /^(ENGL|EWRT)\s*1B$/i, usvCode: "ENG101", type: "partial", score: 85, notes: "Advanced composition, partial credit for ENG101" },
  
  // Public Speaking
  { ccPattern: /^COMM\s*1A?$/i, usvCode: "ENG251", type: "direct", score: 95, notes: "Standard public speaking course" },
  
  // College Algebra
  { ccPattern: /^MATH\s*(106|71|29)$/i, usvCode: "MATH113", type: "direct", score: 95, notes: "College algebra equivalent" },
  
  // Statistics
  { ccPattern: /^MATH\s*(10|13)$/i, usvCode: "MATH113", type: "partial", score: 80, notes: "Statistics course, partial algebra credit" },
  
  // Calculus I
  { ccPattern: /^MATH\s*1A$/i, usvCode: "MATH113", type: "direct", score: 100, notes: "Calculus I exceeds algebra requirement" },
  
  // Psychology
  { ccPattern: /^PSYC\s*1$/i, usvCode: "PSY101", type: "direct", score: 95, notes: "General psychology" },
  
  // Sociology
  { ccPattern: /^SOC\s*1$/i, usvCode: "SOC101", type: "direct", score: 95, notes: "Introduction to sociology" },
  
  // History
  { ccPattern: /^HIST\s*(4A|4B|17A|17B)$/i, usvCode: "HIST101", type: "direct", score: 95, notes: "US history course" },
  
  // Biology
  { ccPattern: /^BIOL\s*(6A|10)$/i, usvCode: "BIO101", type: "direct", score: 95, notes: "General biology" },
  
  // Chemistry
  { ccPattern: /^CHEM\s*1A$/i, usvCode: "CHEM101", type: "direct", score: 95, notes: "General chemistry" },
  
  // Physics
  { ccPattern: /^PHYS\s*(2A|4A)$/i, usvCode: "PHYS101", type: "direct", score: 95, notes: "General physics" },
  
  // Business courses
  { ccPattern: /^(BUS|BUSI)\s*(10|1)$/i, usvCode: "BUS101", type: "direct", score: 95, notes: "Introduction to business" },
  { ccPattern: /^(BUS|BUSI)\s*(11|12)$/i, usvCode: "BUS121", type: "direct", score: 90, notes: "Information systems/data analytics" },
  { ccPattern: /^(BUS|BUSI)\s*(18|20)$/i, usvCode: "BUS201", type: "direct", score: 95, notes: "Business law" },
  { ccPattern: /^(BUS|BUSI)\s*(49|30|20)$/i, usvCode: "BUS301", type: "direct", score: 90, notes: "Principles of management" },
  { ccPattern: /^(BUS|BUSI)\s*(59|90|40)$/i, usvCode: "BUS401", type: "direct", score: 95, notes: "Principles of marketing" },
  { ccPattern: /^(BUS|BUSI)\s*(60|45)$/i, usvCode: "BUS250", type: "direct", score: 90, notes: "Finance fundamentals" },
  { ccPattern: /^(BUS|BUSI)\s*(57|87|40|50)$/i, usvCode: "BUS350", type: "direct", score: 85, notes: "Human resources management" },
  { ccPattern: /^ACCT\s*1A$/i, usvCode: "BUS210", type: "direct", score: 95, notes: "Financial accounting" },
  { ccPattern: /^ACCT\s*1B$/i, usvCode: "BUS220", type: "direct", score: 95, notes: "Managerial accounting" },
  { ccPattern: /^ECON\s*(1|1A)$/i, usvCode: "ECON201", type: "direct", score: 95, notes: "Macroeconomics" },
  { ccPattern: /^ECON\s*(2|1B)$/i, usvCode: "ECON202", type: "direct", score: 95, notes: "Microeconomics" },
  
  // Computer Science courses
  { ccPattern: /^(CS|C\s*S|CIS|CSCI)\s*(1A|2A|3A|10|20|22A|25|26A)$/i, usvCode: "CS101", type: "direct", score: 90, notes: "Introduction to programming" },
  { ccPattern: /^(CS|C\s*S|CIS|CSCI)\s*(1B|2B|3B|22B|35A)$/i, usvCode: "CS201", type: "direct", score: 90, notes: "Intermediate programming/OOP" },
  { ccPattern: /^(CS|C\s*S|CIS|CSCI)\s*(1C|2C|3C|30|22C)$/i, usvCode: "CS301", type: "direct", score: 90, notes: "Data structures and algorithms" },
  { ccPattern: /^(CS|C\s*S|CIS|CSCI)\s*(27|50)$/i, usvCode: "CS250", type: "direct", score: 85, notes: "Database management" },
  { ccPattern: /^(CS|C\s*S|CIS|CSCI)\s*(30|60)$/i, usvCode: "CS350", type: "direct", score: 85, notes: "Web development" },
  
  // Digital Arts courses
  { ccPattern: /^(ART|ARTS)\s*(1A|2A)$/i, usvCode: "ART101", type: "direct", score: 90, notes: "Drawing fundamentals" },
  { ccPattern: /^(ART|ARTS)\s*(10|13A)$/i, usvCode: "ART201", type: "direct", score: 90, notes: "Digital imaging" },
  { ccPattern: /^(ART|ARTS)\s*(20|14)$/i, usvCode: "ART301", type: "direct", score: 90, notes: "3D modeling" },
  { ccPattern: /^(ART|ARTS)\s*(30|15)$/i, usvCode: "ART401", type: "direct", score: 90, notes: "Animation" },
  { ccPattern: /^(GID|ARTS)\s*(10|11|20|30|40)$/i, usvCode: "ART201", type: "elective", score: 75, notes: "Digital design elective" },
  { ccPattern: /^(PHOT|PHTG)\s*1$/i, usvCode: "ART101", type: "partial", score: 70, notes: "Photography as visual arts credit" },
  
  // Music/Audio courses
  { ccPattern: /^(MUS|MUSI)\s*1A$/i, usvCode: "MUS101", type: "direct", score: 95, notes: "Music theory I" },
  { ccPattern: /^(MUS|MUSI)\s*1B$/i, usvCode: "MUS201", type: "direct", score: 95, notes: "Music theory II" },
  { ccPattern: /^(MUS|MUSI)\s*(4A|10A|10)$/i, usvCode: "MUS301", type: "direct", score: 90, notes: "Music technology" },
  { ccPattern: /^(MUS|MUSI)\s*(4B|10B|12A|20)$/i, usvCode: "MUS401", type: "direct", score: 90, notes: "Audio recording/production" },
];

async function generateTargetedArticulations() {
  let totalMappings = 0;
  let directMappings = 0;
  let partialMappings = 0;
  let electiveMappings = 0;
  
  console.log("\n🔄 Starting targeted articulation mapping generation...\n");
  
  // For each community college course, check against articulation rules
  for (const ccCourse of ccCourses) {
    for (const rule of articulationRules) {
      if (rule.ccPattern.test(ccCourse.courseCode)) {
        // Find the matching USV course
        const usvCourse = usvCourses.find(c => c.courseCode === rule.usvCode);
        
        if (usvCourse) {
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
              equivalencyType: rule.type,
              similarityScore: rule.score,
              notes: rule.notes,
              status: rule.score >= 90 ? "approved" : "pending",
              createdBy: 1, // System-generated
            });
            
            totalMappings++;
            if (rule.type === "direct") directMappings++;
            else if (rule.type === "partial") partialMappings++;
            else if (rule.type === "elective") electiveMappings++;
            
            console.log(`✓ ${ccCourse.courseCode} → ${usvCourse.courseCode} (${rule.type}, score: ${rule.score})`);
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

generateTargetedArticulations()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
