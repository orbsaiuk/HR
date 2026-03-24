import { NextResponse } from "next/server";
import { MOCK_PROJECTS } from "@/features/projects/ui/components/project-card/MockProjectCard";

/**
 * GET /api/projects/filters — Get available filter options
 */
export async function GET() {
  try {
    // Extract unique values from mock projects
    const technologies = [
      ...new Set(MOCK_PROJECTS.flatMap((p) => p.technologies || [])),
    ];
    const industries = [
      ...new Set(MOCK_PROJECTS.map((p) => p.industry).filter(Boolean)),
    ];
    const projectTypes = [
      ...new Set(MOCK_PROJECTS.map((p) => p.projectType).filter(Boolean)),
    ];
    const statuses = [
      ...new Set(MOCK_PROJECTS.map((p) => p.status).filter(Boolean)),
    ];

    return NextResponse.json({
      technologies,
      industries,
      projectTypes,
      statuses,
    });
  } catch (error) {
    console.error("GET /api/projects/filters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 },
    );
  }
}
