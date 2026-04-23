import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  buildContractWhatsAppUrl,
  getContractByIdScoped,
  markContractAsSent,
} from "@/features/contracts/services/contractService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function POST(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_CONTRACTS);

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Contract id is required" },
        { status: 400 },
      );
    }

    const contract = await getContractByIdScoped(id, context.orgId);
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 },
      );
    }

    const url = buildContractWhatsAppUrl(contract);

    await markContractAsSent(id);

    await logAuditEvent({
      action: "contract.whatsapp_sent",
      category: "contracts",
      description: `Prepared WhatsApp send for contract \"${contract.title || id}\"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "contract",
      targetId: id,
      metadata: {
        after: JSON.stringify({ status: "sent" }),
      },
    });

    return NextResponse.json({
      success: true,
      url,
    });
  } catch (error) {
    console.error("POST /api/contracts/[id]/send-whatsapp error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to prepare WhatsApp send" },
      { status },
    );
  }
}
