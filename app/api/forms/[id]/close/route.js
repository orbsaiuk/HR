import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { updateForm } from "@/features/forms/services/formService";

export async function POST(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_FORMS);
    const { id } = await params;
    const form = await updateForm(id, { status: "closed" });
    return NextResponse.json(form);
  } catch (error) {
    console.error("Error closing form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to close form" },
      { status },
    );
  }
}
