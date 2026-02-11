import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getTeamMemberIdByClerkId,
  getUserIdByClerkId,
} from "@/features/chat/services/chatService";

export async function GET(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId") || user.id;
    const type =
      searchParams.get("type") || user.publicMetadata?.role || "user";

    // Get Sanity user ID based on type
    const sanityUserId =
      type === "teamMember"
        ? await getTeamMemberIdByClerkId(clerkId)
        : await getUserIdByClerkId(clerkId);

    if (!sanityUserId) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    return NextResponse.json({ sanityUserId });
  } catch (error) {
    console.error("Error fetching Sanity user ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch user ID", details: error.message },
      { status: 500 },
    );
  }
}
