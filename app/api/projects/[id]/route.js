import { NextResponse } from "next/server";
import { projectService } from "@/features/shared/projects/services/projectService";

/**
 * GET /api/projects/[id] — Get a single project (public)
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: "المشروع غير موجود" }, { status: 404 });
    }

    // Format duration string if possible
    let durationText = null;
    if (project.duration?.value) {
      const val = project.duration.value;
      if (val === 1) durationText = "أسبوع واحد";
      else if (val === 2) durationText = "2-4 أسابيع";
      else if (val <= 4) durationText = `${val - 1}-${val} أشهر`;
      else durationText = `${val} أشهر`;
    }

    const projectWithDetails = {
      ...project,
      description: project.description || project.shortDescription,
      durationText: durationText || "2-4 أسابيع",
      experienceLevel: project.experienceLevel || "intermediate",
      applicantsCount: project.proposalsCount || 0,
      client: project.client || {},
    };

    return NextResponse.json(projectWithDetails);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "فشل في تحميل المشروع" },
      { status: 500 },
    );
  }
}
