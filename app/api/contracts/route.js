import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  createContract,
  getContractsByCreator,
  getTemplateByIdScoped,
  incrementTemplateUsage,
} from "@/features/contracts/services/contractService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_CONTRACTS);

    const contracts = await getContractsByCreator(
      context.orgId,
      context.teamMember._id,
    );

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("GET /api/contracts error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch contracts" },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_CONTRACTS);

    const input = await request.json();

    const contract = await createContract(input, {
      orgId: context.orgId,
      userId: context.teamMember._id,
    });

    if (contract?.templateId) {
      try {
        const template = await getTemplateByIdScoped(
          contract.templateId,
          context.orgId,
        );

        if (template?._id) {
          await incrementTemplateUsage(contract.templateId);
        }
      } catch (incrementError) {
        console.error("Failed to increment template usage:", incrementError);
      }
    }

    await logAuditEvent({
      action: "contract.created",
      category: "contracts",
      description: `Created contract \"${contract.title || contract._id}\"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "contract",
      targetId: contract._id,
      metadata: {
        after: JSON.stringify({
          title: contract.title,
          templateId: contract.templateId,
          type: contract.type,
        }),
      },
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("POST /api/contracts error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to create contract" },
      { status },
    );
  }
}
