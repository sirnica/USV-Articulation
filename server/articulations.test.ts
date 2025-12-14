import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@usv.edu",
    name: "Test User",
    loginMethod: "manus",
    role: role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Institutions", () => {
  it("should list all active institutions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const institutions = await caller.institutions.list({ activeOnly: true });

    expect(institutions).toBeDefined();
    expect(Array.isArray(institutions)).toBe(true);
    expect(institutions.length).toBeGreaterThan(0);
    
    // Should include USV
    const usv = institutions.find((inst) => inst.shortName === "USV");
    expect(usv).toBeDefined();
    expect(usv?.type).toBe("university");
    
    // Should include community colleges
    const ccs = institutions.filter((inst) => inst.type === "community_college");
    expect(ccs.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Degree Programs", () => {
  it("should list all degree programs", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const programs = await caller.degreePrograms.list({ activeOnly: true });

    expect(programs).toBeDefined();
    expect(Array.isArray(programs)).toBe(true);
    expect(programs.length).toBe(7); // All 7 USV degree programs
    
    // Check for specific programs
    const programCodes = programs.map((p) => p.code);
    expect(programCodes).toContain("DAT"); // Digital Audio Technology
    expect(programCodes).toContain("BSBA"); // Business Administration
    expect(programCodes).toContain("SD"); // Software Development
    expect(programCodes).toContain("DAA"); // Digital Art and Animation
    expect(programCodes).toContain("GA"); // Game Art
    expect(programCodes).toContain("GD"); // Game Design
    expect(programCodes).toContain("GE"); // Game Engineering
  });
});

describe("Courses", () => {
  it("should retrieve courses for an institution", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get USV institution
    const institutions = await caller.institutions.list({ activeOnly: true });
    const usv = institutions.find((inst) => inst.shortName === "USV");
    expect(usv).toBeDefined();

    const courses = await caller.courses.list({ institutionId: usv!.id });

    expect(courses).toBeDefined();
    expect(Array.isArray(courses)).toBe(true);
    expect(courses.length).toBeGreaterThan(0);
    
    // Check for GE courses
    const eng101 = courses.find((c) => c.courseCode === "ENG101");
    expect(eng101).toBeDefined();
    expect(eng101?.title).toContain("English");
  });

  it("should search courses by term", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const results = await caller.courses.search({ searchTerm: "English" });

    expect(results).toBeDefined();
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    
    // All results should contain "English" in title or description
    results.forEach((course) => {
      const matchFound = 
        course.title.toLowerCase().includes("english") ||
        course.courseCode.toLowerCase().includes("eng") ||
        course.description?.toLowerCase().includes("english");
      expect(matchFound).toBe(true);
    });
  });
});

describe("Articulation Mappings", () => {
  it("should list approved articulation mappings", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const mappings = await caller.articulations.list({ status: "approved" });

    expect(mappings).toBeDefined();
    expect(Array.isArray(mappings)).toBe(true);
    expect(mappings.length).toBeGreaterThan(0);
    
    // All mappings should be approved
    mappings.forEach((item: any) => {
      expect(item.mapping.status).toBe("approved");
      expect(item.ccCourse).toBeDefined();
      expect(item.usvCourse).toBeDefined();
    });
  });

  it("should retrieve statistics", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.stats.dashboard();

    expect(stats).toBeDefined();
    expect(stats.totalCourses).toBeGreaterThan(0);
    expect(stats.totalMappings).toBeGreaterThan(0);
    expect(stats.approvedMappings).toBeGreaterThan(0);
    expect(stats.directEquivalencies).toBeGreaterThan(0);
    
    // Approved mappings should be <= total mappings
    expect(stats.approvedMappings).toBeLessThanOrEqual(stats.totalMappings);
  });
});

describe("Transfer Pathway", () => {
  it("should calculate transfer pathway for a degree program", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get institutions and programs
    const institutions = await caller.institutions.list({ activeOnly: true });
    const programs = await caller.degreePrograms.list({ activeOnly: true });
    
    const foothill = institutions.find((inst) => inst.shortName === "Foothill");
    const businessProgram = programs.find((p) => p.code === "BSBA");
    
    expect(foothill).toBeDefined();
    expect(businessProgram).toBeDefined();

    const pathway = await caller.transfer.getPathway({
      ccInstitutionId: foothill!.id,
      degreeProgramId: businessProgram!.id,
    });

    expect(pathway).toBeDefined();
    expect(Array.isArray(pathway)).toBe(true);
  });

  it("should calculate transfer credits for completed courses", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Get test data
    const institutions = await caller.institutions.list({ activeOnly: true });
    const programs = await caller.degreePrograms.list({ activeOnly: true });
    const foothill = institutions.find((inst) => inst.shortName === "Foothill");
    const businessProgram = programs.find((p) => p.code === "BSBA");
    
    expect(foothill).toBeDefined();
    expect(businessProgram).toBeDefined();

    // Get some Foothill courses
    const courses = await caller.courses.list({ institutionId: foothill!.id });
    const completedCourseIds = courses.slice(0, 3).map((c) => c.id);

    const calculation = await caller.transfer.calculateCredits({
      ccInstitutionId: foothill!.id,
      degreeProgramId: businessProgram!.id,
      completedCourseIds,
    });

    expect(calculation).toBeDefined();
    expect(calculation.totalTransferableUnits).toBeGreaterThanOrEqual(0);
    expect(calculation.fulfilledRequirements).toBeGreaterThanOrEqual(0);
    expect(calculation.totalRequirements).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(calculation.matchedCourses)).toBe(true);
  });
});

describe("GE Areas", () => {
  it("should list all GE areas", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const geAreas = await caller.geAreas.list();

    expect(geAreas).toBeDefined();
    expect(Array.isArray(geAreas)).toBe(true);
    expect(geAreas.length).toBe(7); // 7 GE areas
    
    // Check for specific GE areas
    const codes = geAreas.map((ge) => ge.code);
    expect(codes).toContain("USV101");
    expect(codes).toContain("ENG101");
    expect(codes).toContain("ENG251");
    expect(codes).toContain("ENG302");
    expect(codes).toContain("MATH113");
    expect(codes).toContain("MS");
    expect(codes).toContain("SP");
  });
});
