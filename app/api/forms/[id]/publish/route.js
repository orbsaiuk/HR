import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { updateForm } from "@/features/forms/services/formService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function POST(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_FORMS);
    const { id } = await params;
    const form = await updateForm(id, { status: "published" });

    await logAuditEvent({
      action: "form.published",
      category: "forms",
      description: `Published form "${form.title || id}"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "form",
      targetId: id,
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error publishing form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to publish form" },
      { status },
    );
  }
}
