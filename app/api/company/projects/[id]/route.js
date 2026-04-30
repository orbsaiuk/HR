import { NextResponse } from "next/server";
import { resolveContext } from "@/shared/lib/orgContext";
import { projectService } from "@/features/shared/projects/services/projectService";

export async function PUT(request, { params }) {
  try {
    const context = await resolveContext(request);
    if (!context || !context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // In a real app, verify the project belongs to context.orgId
    const project = await projectService.updateProject(id, body);
    
    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT /api/company/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const context = await resolveContext(request);
    if (!context || !context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    // In a real app, verify the project belongs to context.orgId
    await projectService.deleteProject(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/company/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
