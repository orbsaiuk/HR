import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  isOwner,
  removeTeamMember,
  getOwnerTeamMember,
} from "@/features/team-member-management/services/teamMemberManagementService";

export async function DELETE(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerCheck = await isOwner(user.id);
    if (!ownerCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Prevent owner from removing themselves
    const owner = await getOwnerTeamMember();
    if (owner && owner._id === id) {
      return NextResponse.json(
        { error: "Cannot remove the account owner" },
        { status: 400 },
      );
    }

    await removeTeamMember(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { error: "Failed to remove team member" },
      { status: 500 },
    );
  }
}
