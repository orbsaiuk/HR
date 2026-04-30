import { NextResponse } from "next/server";
import { resolveContext } from "@/shared/lib/orgContext";
import { projectService } from "@/features/shared/projects/services/projectService";

export async function GET(request) {
  try {
    const context = await resolveContext(request);
    if (!context || !context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await projectService.getCompanyProjects(context.orgId);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/company/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const context = await resolveContext(request);
    if (!context || !context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const project = await projectService.createProject({
      ...body,
      org_id: context.orgId,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/company/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
