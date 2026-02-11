import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  findOrCreateConversation,
  getTeamMemberIdByClerkId,
  getUserIdByClerkId,
  getConversations,
} from "@/features/chat/services/chatService";

export async function GET(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = user.publicMetadata?.role || "user";

    // Get Sanity user ID based on role
    const sanityUserId =
      role === "teamMember"
        ? await getTeamMemberIdByClerkId(user.id)
        : await getUserIdByClerkId(user.id);

    if (!sanityUserId) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    // Fetch conversations
    const conversations = await getConversations(role, sanityUserId);

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamMemberRole = user.publicMetadata?.role;
    if (teamMemberRole !== "teamMember") {
      return NextResponse.json(
        { error: "Only team members can create conversations" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { userId, formId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Get team member's Sanity ID
    const teamMemberId = await getTeamMemberIdByClerkId(user.id);

    if (!teamMemberId) {
      return NextResponse.json(
        { error: "Team member not found in database" },
        { status: 404 },
      );
    }

    // Find or create conversation
    const conversation = await findOrCreateConversation(
      teamMemberId,
      userId,
      formId,
    );

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation", details: error.message },
      { status: 500 },
    );
  }
}
