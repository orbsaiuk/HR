import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { currentUser } from "@clerk/nextjs/server";
import { getConversationById } from "@/features/chat/services/chatService";

// GET a single conversation by ID
export async function GET(request, { params }) {
  try {
    // Conversations can be accessed by both team members (org-scoped) and regular users
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If team member, validate org context and check permissions
    if (user.publicMetadata?.role === "teamMember") {
      const context = await resolveOrgContext();
      requirePermission(context, PERMISSIONS.VIEW_MESSAGES);
    }

    const { id: conversationId } = await params;
    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Failed to fetch conversation", details: error.message },
      { status },
    );
  }
}
