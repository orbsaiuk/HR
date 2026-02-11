import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getMessages,
  sendMessage,
  getConversationById,
} from "@/features/chat/services/chatService";

// GET messages for a conversation
export async function GET(request, { params }) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const messages = await getMessages(conversationId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500 },
    );
  }
}

// POST a new message
export async function POST(request, { params }) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: conversationId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Message content is required" },
        { status: 400 },
      );
    }

    // Get the conversation to determine sender and recipient
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Determine if current user is team member or user
    const isTeamMember = user.id === conversation.teamMember.clerkId;
    const senderId = isTeamMember
      ? conversation.teamMember._id
      : conversation.user._id;
    const recipientId = isTeamMember
      ? conversation.user._id
      : conversation.teamMember._id;

    // Create the message
    const message = await sendMessage(
      conversationId,
      senderId,
      recipientId,
      content.trim(),
    );

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message", details: error.message },
      { status: 500 },
    );
  }
}
