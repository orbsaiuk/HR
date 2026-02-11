import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition,
} from "@/features/job-positions/services/jobPositionService";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json(
      { error: "Failed to fetch position" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = await request.json();
    const position = await updateJobPosition(id, input);
    return NextResponse.json(position);
  } catch (error) {
    console.error("Error updating position:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update position" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteJobPosition(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting position:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete position" },
      { status: 500 },
    );
  }
}
