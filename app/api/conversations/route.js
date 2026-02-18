import { NextResponse } from "next/server";
import { resolveOrgContext, OrgContextError } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { currentUser } from "@clerk/nextjs/server";
import {
  findOrCreateConversation,
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

    // Team members use org context with permission check
    if (role === "teamMember") {
      try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.VIEW_MESSAGES);
        const conversations = await getConversations(role, context.teamMember._id, context.orgId);
        return NextResponse.json(conversations);
      } catch (error) {
        // If no organization is selected yet, return empty conversations
        if (error instanceof OrgContextError) {
          return NextResponse.json([]);
        }
        throw error;
      }
    }

    // Regular users don't need org context
    const sanityUserId = await getUserIdByClerkId(user.id);
    if (!sanityUserId) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 },
      );
    }

    const conversations = await getConversations(role, sanityUserId);
    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Failed to fetch conversations", details: error.message },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_MESSAGES);

    const body = await request.json();
    const { userId, formId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    // Find or create conversation with org context
    const conversation = await findOrCreateConversation(
      context.teamMember._id,
      userId,
      formId,
      context.orgId,
    );

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: "Failed to create conversation", details: error.message },
      { status },
    );
  }
}
