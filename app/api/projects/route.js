import { NextResponse } from "next/server";
import { projectService } from "@/features/shared/projects/services/projectService";

/**
 * GET /api/projects — List all projects (public)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const projectType = searchParams.get("projectType") || "";
    const industry = searchParams.get("industry") || "";
    const technology = searchParams.get("technology") || "";
    const status = searchParams.get("status") || "open";

    let projects = await projectService.getProjects({ status });

    // Apply filters
    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q),
      );
    }

    if (projectType) {
      projects = projects.filter((p) => p.projectType === projectType);
    }

    if (industry) {
      projects = projects.filter((p) => p.industry === industry);
    }

    if (technology) {
      projects = projects.filter((p) =>
        p.technologies?.some(
          (t) => t.toLowerCase() === technology.toLowerCase(),
        ),
      );
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
