import { NextResponse } from "next/server";
import { resolveContext } from "@/shared/lib/orgContext";
import { getFreelancerProjects } from "@/features/shared/projects/services/projectService";

export async function GET(request) {
  try {
    const context = await resolveContext(request);
    if (!context || !context.teamMember?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await getFreelancerProjects(context.teamMember._id);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/freelancer/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

