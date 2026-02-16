import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { updateResponseStatusWithDetails } from "@/features/responses/services/responseService";

export async function PATCH(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const { status, statusNote, rejectionReason } = await request.json();

    const response = await updateResponseStatusWithDetails(id, {
      status,
      statusNote,
      rejectionReason,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating response status:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status },
    );
  }
}
