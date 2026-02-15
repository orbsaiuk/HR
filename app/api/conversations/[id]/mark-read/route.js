import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  markAsRead,
  getConversationById,
} from "@/features/chat/services/chatService";

// PATCH - Mark messages as read
export async function PATCH(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If team member, validate org context
    if (user.publicMetadata?.role === "teamMember") {
      await resolveOrgContext();
    }

    const { id: conversationId } = await params;

    // Get the conversation to determine the current user's ID
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Determine if current user is team member or user
    const isTeamMember = user.id === conversation.teamMember.clerkId;
    const userId = isTeamMember
      ? conversation.teamMember._id
      : conversation.user._id;

    // Mark all unread messages as read for this user
    await markAsRead(conversationId, userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Failed to mark messages as read", details: error.message },
      { status },
    );
  }
}
