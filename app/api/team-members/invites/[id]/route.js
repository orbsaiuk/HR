import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { deleteInvite } from "@/features/team-member-management/services/teamMemberManagementService";

export async function DELETE(request, { params }) {
  try {
    const { orgRole } = await resolveOrgContext();

    // Only admins can delete invites
    if (orgRole !== "org:admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await deleteInvite(id);
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
