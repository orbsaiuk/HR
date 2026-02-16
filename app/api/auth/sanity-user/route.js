import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/features/chat/services/chatService";

export async function GET(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get("clerkId") || user.id;

    // Since team members are now embedded in organizations and both
    // team members and regular users reference the same user document,
    // we always look up the user document by clerkId.
    const sanityUserId = await getUserIdByClerkId(clerkId);

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
