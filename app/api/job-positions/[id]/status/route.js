import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { updateJobPositionStatus } from "@/features/job-positions/services/jobPositionService";

export async function PATCH(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;

    const { status } = await request.json();
    if (!status || !["draft", "open", "on-hold", "closed"].includes(status)) {
      return NextResponse.json(
        {
          error: "Invalid status. Must be one of: draft, open, on-hold, closed",
        },
        { status: 400 },
      );
    }

    const position = await updateJobPositionStatus(id, status);
    return NextResponse.json(position);
  } catch (error) {
    console.error("Error updating position status:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status },
    );
  }
}
