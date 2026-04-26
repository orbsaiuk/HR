import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getContractByIdScoped } from "@/features/company/contracts/services/contractService";
import { generateContractPdfBuffer } from "@/features/company/contracts/services/contractPdfService";
import { logAuditEvent } from "@/features/company/audit/services/auditService";

export const runtime = "nodejs";

function normalizeFileSegment(value, fallback) {
  const cleaned = String(value || "")
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/\s+/g, " ");

  const slug = cleaned
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);

  return slug || fallback;
}

function buildSecondPartyFullName(contract) {
  const formData = contract?.formData && typeof contract.formData === "object"
    ? contract.formData
    : {};

  const firstName = String(formData.secondPartyFirstName || "").trim();
  const lastName = String(formData.secondPartyLastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || String(formData.secondPartyFullName || "").trim();
}

function formatCreatedDate(createdAt) {
  if (!createdAt) return "unknown-date";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "unknown-date";

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildPdfFileName(contract) {
  const secondPartyName = normalizeFileSegment(
    buildSecondPartyFullName(contract),
    "unknown-party",
  );
  const createdDate = formatCreatedDate(contract?.createdAt);

  return `contract-${secondPartyName}-${createdDate}.pdf`;
}

export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_CONTRACTS);

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Contract id is required" }, { status: 400 });
    }

    const contract = await getContractByIdScoped(id, context.orgId);

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    const pdfBuffer = await generateContractPdfBuffer(contract);
    const fileName = buildPdfFileName(contract);

    await logAuditEvent({
      action: "contract.pdf_downloaded",
      category: "contracts",
      description: `Downloaded PDF for contract \"${contract.title || id}\"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "contract",
      targetId: contract._id || id,
      metadata: {
        after: JSON.stringify({
          fileName,
          format: "pdf",
        }),
      },
    });

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/contracts/[id]/download error:", error);
    const status = error.status || 500;

    return NextResponse.json(
      { error: error.message || "Failed to download contract PDF" },
      { status },
    );
  }
}
