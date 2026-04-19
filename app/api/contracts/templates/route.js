import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  createTemplate,
  getTemplatesByOrg,
} from "@/features/contracts/services/contractService";
import { logAuditEvent } from "@/features/audit/services/auditService";

function validateTemplateInput(input = {}) {
  const title = String(input.title || "").trim();
  const type = String(input.type || "").trim();
  const clauses = Array.isArray(input.clauses)
    ? input.clauses
        .map((clause) => ({ text: String(clause?.text || "").trim() }))
        .filter((clause) => clause.text.length > 0)
    : [];

  if (!title) {
    const error = new Error("Template title is required");
    error.status = 400;
    throw error;
  }

  if (!type) {
    const error = new Error("Template type is required");
    error.status = 400;
    throw error;
  }

  if (clauses.length === 0) {
    const error = new Error("At least one clause is required");
    error.status = 400;
    throw error;
  }

  return {
    ...input,
    title,
    type,
    clauses,
  };
}

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_CONTRACTS);

    const templates = await getTemplatesByOrg(context.orgId);

    return NextResponse.json(templates);
  } catch (error) {
    console.error("GET /api/contracts/templates error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch contract templates" },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_CONTRACTS);

    const input = validateTemplateInput(await request.json());

    const template = await createTemplate(input, {
      orgId: context.orgId,
      userId: context.teamMember._id,
    });

    await logAuditEvent({
      action: "contract_template.created",
      category: "contracts",
      description: `Created contract template \"${template.title || template._id}\"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "contractTemplate",
      targetId: template._id,
      metadata: {
        after: JSON.stringify({
          title: template.title,
          type: template.type,
        }),
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("POST /api/contracts/templates error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to create contract template" },
      { status },
    );
  }
}
