import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission, hasPermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getJobPositions,
  getJobPositionsAssignedToUser,
  createJobPosition,
} from "@/features/job-positions/services/jobPositionService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_POSITIONS);

    // Resource-level permissions:
    // - manage_positions → see ALL positions in the org
    // - view_positions only → see only positions where user is recruiter or in assignedTo
    const canManage = hasPermission(context, PERMISSIONS.MANAGE_POSITIONS);
    const positions = canManage
      ? await getJobPositions(context.orgId)
      : await getJobPositionsAssignedToUser(context.orgId, context.teamMember._id);

    return NextResponse.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_POSITIONS);
    const input = await request.json();
    const position = await createJobPosition(input, context.orgId);

    await logAuditEvent({
      action: "position.created",
      category: "positions",
      description: `Created position "${input.title || "Untitled"}"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "position",
      targetId: position._id,
    });

    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to create position" },
      { status },
    );
  }
}
