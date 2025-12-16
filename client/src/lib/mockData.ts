// Mock data to replace tRPC calls temporarily

export const mockInstitutions = [
  { id: 1, name: "University of Silicon Valley", type: "university", active: true },
  { id: 2, name: "Foothill College", type: "community_college", active: true },
  { id: 3, name: "San José City College", type: "community_college", active: true },
  { id: 4, name: "Evergreen Valley College", type: "community_college", active: true },
  { id: 5, name: "De Anza College", type: "community_college", active: true },
  { id: 6, name: "Sierra College", type: "community_college", active: true },
];

export const mockDegreePrograms = [
  { id: 1, name: "Game Design", degreeType: "Bachelor of Science", active: true, institutionId: 1 },
  { id: 2, name: "Game Art", degreeType: "Bachelor of Fine Arts", active: true, institutionId: 1 },
  { id: 3, name: "Game Engineering", degreeType: "Bachelor of Science", active: true, institutionId: 1 },
  { id: 4, name: "Digital Art & Animation", degreeType: "Bachelor of Fine Arts", active: true, institutionId: 1 },
  { id: 5, name: "Software Development", degreeType: "Bachelor of Science", active: true, institutionId: 1 },
  { id: 6, name: "Business Administration", degreeType: "Bachelor of Science", active: true, institutionId: 1 },
  { id: 7, name: "Digital Audio Technology", degreeType: "Bachelor of Science", active: true, institutionId: 1 },
];

export const mockCourses = [
  // Foothill College courses
  { id: 101, courseCode: "ENGL 1A", title: "Composition & Reading", units: 5, institutionId: 2 },
  { id: 102, courseCode: "COMM 1A", title: "Public Speaking", units: 4, institutionId: 2 },
  { id: 103, courseCode: "MATH 106", title: "College Algebra", units: 5, institutionId: 2 },
  { id: 104, courseCode: "PSYC 1", title: "General Psychology", units: 4, institutionId: 2 },
  { id: 105, courseCode: "BIOL 10", title: "General Biology", units: 5, institutionId: 2 },
  
  // SJCC courses
  { id: 201, courseCode: "ENGL C1000", title: "Academic Reading & Writing", units: 3, institutionId: 3 },
  { id: 202, courseCode: "COMM C1000", title: "Public Speaking", units: 3, institutionId: 3 },
  { id: 203, courseCode: "MATH 112", title: "College Algebra", units: 4, institutionId: 3 },
  { id: 204, courseCode: "PSYC C1000", title: "General Psychology", units: 3, institutionId: 3 },
  { id: 205, courseCode: "BUS 020", title: "Principles of Marketing", units: 3, institutionId: 3 },
  
  // USV courses
  { id: 1001, courseCode: "ENG101", title: "English Composition", units: 3, institutionId: 1 },
  { id: 1002, courseCode: "COM101", title: "Oral Communication", units: 3, institutionId: 1 },
  { id: 1003, courseCode: "MATH113", title: "College Algebra", units: 3, institutionId: 1 },
  { id: 1004, courseCode: "PSY101", title: "Introduction to Psychology", units: 3, institutionId: 1 },
  { id: 1005, courseCode: "BUS141", title: "Principles of Marketing", units: 3, institutionId: 1 },
];

export const mockArticulations = [
  {
    mapping: { id: 1, equivalencyType: "direct", status: "approved", notes: "Direct transfer for composition requirement" },
    ccCourse: mockCourses.find(c => c.id === 101),
    usvCourse: mockCourses.find(c => c.id === 1001),
    institution: mockInstitutions.find(i => i.id === 2),
  },
  {
    mapping: { id: 2, equivalencyType: "direct", status: "approved", notes: "Direct transfer for speech requirement" },
    ccCourse: mockCourses.find(c => c.id === 102),
    usvCourse: mockCourses.find(c => c.id === 1002),
    institution: mockInstitutions.find(i => i.id === 2),
  },
  {
    mapping: { id: 3, equivalencyType: "direct", status: "approved", notes: "Direct transfer for algebra requirement" },
    ccCourse: mockCourses.find(c => c.id === 103),
    usvCourse: mockCourses.find(c => c.id === 1003),
    institution: mockInstitutions.find(i => i.id === 2),
  },
  {
    mapping: { id: 4, equivalencyType: "direct", status: "approved", notes: "Fulfills social science GE" },
    ccCourse: mockCourses.find(c => c.id === 104),
    usvCourse: mockCourses.find(c => c.id === 1004),
    institution: mockInstitutions.find(i => i.id === 2),
  },
  {
    mapping: { id: 5, equivalencyType: "direct", status: "approved", notes: "Direct transfer for marketing" },
    ccCourse: mockCourses.find(c => c.id === 205),
    usvCourse: mockCourses.find(c => c.id === 1005),
    institution: mockInstitutions.find(i => i.id === 3),
  },
];

export const mockUser = {
  id: 1,
  name: "Demo User",
  email: "demo@usv.edu",
  role: "student" as const,
};

// Mock API responses
export const mockTRPC = {
  institutions: {
    list: { useQuery: () => ({ data: mockInstitutions }) },
  },
  degreePrograms: {
    list: { useQuery: () => ({ data: mockDegreePrograms }) },
  },
  articulations: {
    list: { useQuery: () => ({ data: mockArticulations }) },
  },
  transfer: {
    getPathway: { useQuery: () => ({ data: [] }) },
    calculateCredits: { useQuery: () => ({ data: null }) },
  },
};
