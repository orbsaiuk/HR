import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { deleteInvite } from "@/features/team-member-management/services/teamMemberManagementService";

export async function DELETE(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_TEAM);

    const { id } = await params;
    // id is the _key of the invite entry in the embedded invites array
    await deleteInvite(id, context.orgId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invite:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to delete invite" },
      { status },
    );
  }
}
