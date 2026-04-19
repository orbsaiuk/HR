import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getContractByIdScoped } from "@/features/contracts/services/contractService";

export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_CONTRACTS);

    const { id } = params;

    const contract = await getContractByIdScoped(id, context.orgId);
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("GET /api/contracts/[id] error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch contract" },
      { status },
    );
  }
}
