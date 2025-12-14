import { drizzle } from "drizzle-orm/mysql2";
import { 
  institutions, 
  degreePrograms, 
  courses, 
  geAreas,
  degreeRequirements,
  articulationMappings,
  geMappings
} from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seedData() {
  console.log("Starting database seeding...");

  // 1. Create Institutions
  console.log("Creating institutions...");
  const [usvResult] = await db.insert(institutions).values({
    name: "University of Silicon Valley",
    shortName: "USV",
    type: "university",
    website: "https://www.usv.edu",
    catalogUrl: "https://usvedu.wpenginepowered.com/wp-content/uploads/2025/11/25-26-USV-Catalog-with-Addendum-Sep-20252.pdf",
    active: true,
  });
  const usvId = usvResult.insertId;

  const ccData = [
    { name: "Foothill College", shortName: "Foothill", website: "https://foothill.edu" },
    { name: "De Anza College", shortName: "De Anza", website: "https://deanza.edu" },
    { name: "San José City College", shortName: "SJCC", website: "https://sjcc.edu" },
    { name: "Evergreen Valley College", shortName: "Evergreen", website: "https://evc.edu" },
    { name: "Sierra College", shortName: "Sierra", website: "https://sierracollege.edu" },
  ];

  const ccIds = {};
  for (const cc of ccData) {
    const [result] = await db.insert(institutions).values({
      ...cc,
      type: "community_college",
      active: true,
    });
    ccIds[cc.shortName] = result.insertId;
  }

  // 2. Create Degree Programs
  console.log("Creating degree programs...");
  const degreeData = [
    { name: "Digital Audio Technology", code: "DAT", degreeType: "Bachelor of Science", department: "Digital Audio Technology", totalUnitsRequired: 120 },
    { name: "Business Administration", code: "BSBA", degreeType: "Bachelor of Science", department: "Business, Entrepreneurship and Innovation", totalUnitsRequired: 120 },
    { name: "Software Development", code: "SD", degreeType: "Bachelor of Science", department: "Computer Science", totalUnitsRequired: 120 },
    { name: "Digital Art and Animation", code: "DAA", degreeType: "Bachelor of Arts", department: "Digital Art and Animation", totalUnitsRequired: 120 },
    { name: "Game Art", code: "GA", degreeType: "Bachelor of Arts", department: "Game Design and Development", totalUnitsRequired: 120 },
    { name: "Game Design", code: "GD", degreeType: "Bachelor of Arts", department: "Game Design and Development", totalUnitsRequired: 120 },
    { name: "Game Engineering", code: "GE", degreeType: "Bachelor of Science", department: "Game Design and Development", totalUnitsRequired: 120 },
  ];

  const degreeIds = {};
  for (const degree of degreeData) {
    const [result] = await db.insert(degreePrograms).values(degree);
    degreeIds[degree.code] = result.insertId;
  }

  // 3. Create GE Areas
  console.log("Creating GE areas...");
  const geData = [
    { code: "USV101", label: "USV Foundations", description: "Freshman seminar providing foundational skills", transferable: false, color: "bg-purple-100 text-purple-800" },
    { code: "ENG101", label: "English Composition", description: "College-level writing and composition", transferable: true, color: "bg-blue-100 text-blue-800" },
    { code: "ENG251", label: "Speech and Oral Communication", description: "Public speaking and communication", transferable: true, color: "bg-green-100 text-green-800" },
    { code: "ENG302", label: "Writing for Professionals", description: "Advanced professional writing", transferable: true, color: "bg-cyan-100 text-cyan-800" },
    { code: "MATH113", label: "College Algebra", description: "College algebra and quantitative reasoning", transferable: true, color: "bg-indigo-100 text-indigo-800" },
    { code: "MS", label: "Math or Science Course", description: "Mathematics or natural sciences", transferable: true, color: "bg-pink-100 text-pink-800" },
    { code: "SP", label: "Social Perspectives Course", description: "Social sciences and humanities", transferable: true, color: "bg-amber-100 text-amber-800" },
  ];

  const geIds = {};
  for (const ge of geData) {
    const [result] = await db.insert(geAreas).values(ge);
    geIds[ge.code] = result.insertId;
  }

  // 4. Create Sample USV Courses
  console.log("Creating USV courses...");
  const usvCourses = [
    { courseCode: "USV101", title: "USV Foundations", units: 4, description: "Introduction to university learning and critical thinking" },
    { courseCode: "ENG101", title: "English Composition", units: 4, description: "College-level writing and composition" },
    { courseCode: "ENG251", title: "Speech and Oral Communication", units: 4, description: "Public speaking and oral communication skills" },
    { courseCode: "ENG302", title: "Writing for Professionals", units: 4, description: "Advanced professional and technical writing" },
    { courseCode: "MATH113", title: "College Algebra", units: 4, description: "College algebra and functions" },
    { courseCode: "BUS121", title: "Digital Technology and Communications", units: 4, description: "Information systems and digital communications" },
    { courseCode: "BUS141", title: "Principles of Marketing", units: 4, description: "Marketing fundamentals and strategies" },
    { courseCode: "BUS250", title: "Finance", units: 4, description: "Corporate finance and financial management" },
    { courseCode: "BUS125", title: "Business Law", units: 4, description: "Legal environment of business" },
    { courseCode: "BUS246", title: "Business Intelligence and Analytics", units: 4, description: "Data analytics for business decisions" },
    { courseCode: "CS101", title: "Fundamentals of Computing", units: 4, description: "Introduction to computer science and programming" },
    { courseCode: "CS201", title: "Data Structures", units: 4, description: "Fundamental data structures and algorithms" },
    { courseCode: "GAM101", title: "Introduction to Game Design", units: 4, description: "Game design principles and concepts" },
    { courseCode: "GAM201", title: "Game Programming Fundamentals", units: 4, description: "Programming for game development" },
    { courseCode: "DAT101", title: "Introduction to Digital Audio", units: 4, description: "Digital audio fundamentals and production" },
  ];

  const usvCourseIds = {};
  for (const course of usvCourses) {
    const [result] = await db.insert(courses).values({
      ...course,
      institutionId: usvId,
      active: true,
    });
    usvCourseIds[course.courseCode] = result.insertId;
  }

  // 5. Create Sample Community College Courses
  console.log("Creating community college courses...");
  const ccCoursesData = [
    // Foothill College
    { institution: "Foothill", courseCode: "BUSI 11", title: "Introduction to Information Systems", units: 5, description: "Information systems and technology in business" },
    { institution: "Foothill", courseCode: "BUSI 60", title: "Fundamentals of Finance", units: 5, description: "Financial management and corporate finance" },
    { institution: "Foothill", courseCode: "ENGL 1A", title: "Composition & Reading", units: 5, description: "College composition and critical reading" },
    { institution: "Foothill", courseCode: "COMM 1A", title: "Public Speaking", units: 5, description: "Oral communication and public speaking" },
    { institution: "Foothill", courseCode: "MATH 106", title: "College Algebra", units: 5, description: "College algebra and functions" },
    // San José City College
    { institution: "SJCC", courseCode: "BUS 020", title: "Principles of Marketing", units: 3, description: "Marketing principles and strategies" },
    { institution: "SJCC", courseCode: "BUS 025", title: "Business Law", units: 3, description: "Legal aspects of business" },
    { institution: "SJCC", courseCode: "ENGL C1000", title: "Academic Reading & Writing", units: 4, description: "Academic writing and composition" },
    { institution: "SJCC", courseCode: "COMM C1000", title: "Public Speaking", units: 3, description: "Public speaking fundamentals" },
    { institution: "SJCC", courseCode: "MATH 112", title: "College Algebra", units: 4, description: "College algebra" },
    // De Anza College
    { institution: "De Anza", courseCode: "BUS 1", title: "Introduction to Business", units: 4, description: "Business fundamentals and environment" },
    { institution: "De Anza", courseCode: "EWRT 1A", title: "Reading and Composition", units: 5, description: "College reading and writing" },
    { institution: "De Anza", courseCode: "MATH 114", title: "Analytic Geometry and Calculus", units: 5, description: "Calculus and analytical geometry" },
    // Evergreen Valley College
    { institution: "Evergreen", courseCode: "ENGL 001A", title: "Composition & Reading", units: 4, description: "College composition" },
    { institution: "Evergreen", courseCode: "SPCH 001", title: "Public Speaking", units: 3, description: "Public speaking skills" },
    { institution: "Evergreen", courseCode: "MATH 061", title: "Finite Mathematics", units: 4, description: "Finite mathematics for business" },
    // Sierra College
    { institution: "Sierra", courseCode: "BUS 1", title: "Introduction to Business", units: 3, description: "Business principles" },
    { institution: "Sierra", courseCode: "ENGL 1A", title: "Composition and Reading", units: 4, description: "College composition" },
    { institution: "Sierra", courseCode: "COMM 1", title: "Public Speaking", units: 3, description: "Public speaking" },
  ];

  const ccCourseIds = {};
  for (const course of ccCoursesData) {
    const [result] = await db.insert(courses).values({
      courseCode: course.courseCode,
      title: course.title,
      units: course.units,
      description: course.description,
      institutionId: ccIds[course.institution],
      active: true,
    });
    ccCourseIds[`${course.institution}-${course.courseCode}`] = result.insertId;
  }

  // 6. Create Sample Articulation Mappings
  console.log("Creating articulation mappings...");
  const mappingsData = [
    { cc: "Foothill-BUSI 11", usv: "BUS121", type: "direct", score: 85 },
    { cc: "Foothill-BUSI 60", usv: "BUS250", type: "direct", score: 88 },
    { cc: "Foothill-ENGL 1A", usv: "ENG101", type: "direct", score: 92 },
    { cc: "Foothill-COMM 1A", usv: "ENG251", type: "direct", score: 90 },
    { cc: "Foothill-MATH 106", usv: "MATH113", type: "direct", score: 95 },
    { cc: "SJCC-BUS 020", usv: "BUS141", type: "direct", score: 92 },
    { cc: "SJCC-BUS 025", usv: "BUS125", type: "direct", score: 90 },
    { cc: "SJCC-ENGL C1000", usv: "ENG101", type: "direct", score: 88 },
    { cc: "SJCC-COMM C1000", usv: "ENG251", type: "direct", score: 85 },
    { cc: "SJCC-MATH 112", usv: "MATH113", type: "direct", score: 93 },
    { cc: "De Anza-EWRT 1A", usv: "ENG101", type: "direct", score: 90 },
    { cc: "Evergreen-ENGL 001A", usv: "ENG101", type: "direct", score: 87 },
    { cc: "Evergreen-SPCH 001", usv: "ENG251", type: "direct", score: 86 },
    { cc: "Sierra-ENGL 1A", usv: "ENG101", type: "direct", score: 89 },
    { cc: "Sierra-COMM 1", usv: "ENG251", type: "direct", score: 88 },
  ];

  for (const mapping of mappingsData) {
    const ccCourseId = ccCourseIds[mapping.cc];
    const usvCourseId = usvCourseIds[mapping.usv];
    
    if (ccCourseId && usvCourseId) {
      await db.insert(articulationMappings).values({
        ccCourseId,
        usvCourseId,
        equivalencyType: mapping.type,
        similarityScore: mapping.score,
        status: "approved",
        createdBy: 1,
        notes: "Initial seed data mapping",
      });
    }
  }

  console.log("Database seeding completed successfully!");
  console.log(`- Created ${Object.keys(ccIds).length + 1} institutions`);
  console.log(`- Created ${degreeData.length} degree programs`);
  console.log(`- Created ${geData.length} GE areas`);
  console.log(`- Created ${usvCourses.length} USV courses`);
  console.log(`- Created ${ccCoursesData.length} community college courses`);
  console.log(`- Created ${mappingsData.length} articulation mappings`);
}

seedData()
  .then(() => {
    console.log("Seeding complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
