import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission, hasPermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getForms, getFormsAssignedToUser, createForm } from "@/features/forms/services/formService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_FORMS);

    // Resource-level permissions:
    // - manage_forms → see ALL forms in the org
    // - view_forms only → see only forms where user is creator or in assignedTo
    const canManage = hasPermission(context, PERMISSIONS.MANAGE_FORMS);
    const forms = canManage
      ? await getForms(context.orgId)
      : await getFormsAssignedToUser(context.orgId, context.teamMember._id);

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_FORMS);
    const input = await request.json();
    const form = await createForm(input, context.orgId);

    await logAuditEvent({
      action: "form.created",
      category: "forms",
      description: `Created form "${input.title || "Untitled"}"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "form",
      targetId: form._id,
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error("Error creating form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to create form" },
      { status },
    );
  }
}
