import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { isOwner } from "@/features/team-member-management/services/teamMemberManagementService";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerCheck = await isOwner(user.id);
    return NextResponse.json({ isOwner: ownerCheck });
  } catch (error) {
    console.error("Error checking owner status:", error);
    return NextResponse.json(
      { error: "Failed to check owner status" },
      { status: 500 },
    );
  }
}
