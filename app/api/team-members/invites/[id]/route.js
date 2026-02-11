import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  isOwner,
  deleteInvite,
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
    await deleteInvite(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invite:", error);
    return NextResponse.json(
      { error: "Failed to delete invite" },
      { status: 500 },
    );
  }
}
