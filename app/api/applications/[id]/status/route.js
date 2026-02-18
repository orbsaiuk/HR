import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { updateApplicationStatus } from "@/features/applications/services/applicationService";

const VALID_STATUSES = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

export async function PATCH(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_APPLICATIONS);
    const { id } = await params;

    const body = await request.json();
    const { status, notes, rejectionReason, rating } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const application = await updateApplicationStatus(id, status, {
      notes,
      rejectionReason,
      rating,
    });
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status },
    );
  }
}
