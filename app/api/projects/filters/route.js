import { NextResponse } from "next/server";
import { projectService } from "@/features/shared/projects/services/projectService";

/**
 * GET /api/projects/filters — Get available filter options
 */
export async function GET() {
  try {
    const filters = await projectService.getProjectFilters();
    return NextResponse.json(filters);
  } catch (error) {
    console.error("GET /api/projects/filters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 },
    );
  }
}
