import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { client } from "@/sanity/client";

export async function PATCH(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const { status, statusNote, rejectionReason } = await request.json();

    const updateData = {
      status,
      statusNote: statusNote || "",
      updatedAt: new Date().toISOString(),
      // Set notification flags when status is updated
      statusUpdated: true,
      statusViewed: false,
    };

    // Add rejection reason if status is rejected
    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const response = await client.patch(id).set(updateData).commit();

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
