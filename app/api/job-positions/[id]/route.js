import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition,
} from "@/features/job-positions/services/jobPositionService";

export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_POSITIONS);
    const { id } = await params;

    const position = await getJobPositionById(id);
    if (!position) {
      return NextResponse.json(
        { error: "Position not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error("Error fetching position:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch position" },
      { status },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_POSITIONS);
    const { id } = await params;
    const input = await request.json();
    const position = await updateJobPosition(id, input);
    return NextResponse.json(position);
  } catch (error) {
    console.error("Error updating position:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update position" },
      { status },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_POSITIONS);
    const { id } = await params;
    await deleteJobPosition(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting position:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to delete position" },
      { status },
    );
  }
}
