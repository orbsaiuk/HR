import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getOwnerTeamMember,
  removeTeamMember,
} from "@/features/team-member-management/services/teamMemberManagementService";

export async function DELETE(request, { params }) {
  try {
    const { orgId, orgRole } = await resolveOrgContext();

    // Only admins can remove team members
    if (orgRole !== "org:admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent removing the org owner (first/earliest joined team member)
    const owner = await getOwnerTeamMember(orgId);
    if (owner && owner.user._id === id) {
      return NextResponse.json(
        { error: "Cannot remove the account owner" },
        { status: 400 },
      );
    }

    await removeTeamMember(id, orgId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to remove team member" },
      { status },
    );
  }
}
