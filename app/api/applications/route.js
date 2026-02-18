import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getApplications,
  createApplication,
} from "@/features/applications/services/applicationService";

export async function GET(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_APPLICATIONS);
    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get("positionId");

    // If a positionId filter is provided, use the position-scoped query
    if (positionId) {
      const { getApplicationsByPosition } =
        await import("@/features/applications/services/applicationService");
      const apps = await getApplicationsByPosition(positionId);
      return NextResponse.json(apps);
    }

    const apps = await getApplications(context.orgId);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching applications:", error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = await request.json();
    const application = await createApplication(input);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    const status = error.message?.includes("already applied") ? 409 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status },
    );
  }
}
