import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getResponseById,
  deleteResponse,
} from "@/features/responses/services/responseService";

export async function GET(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const response = await getResponseById(id);

    if (!response) {
      return NextResponse.json(
        { error: "Response not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching response:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    await deleteResponse(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting response:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to delete response" },
      { status },
    );
  }
}
