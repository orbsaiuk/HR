import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { updateJobPositionStatus } from "@/features/job-positions/services/jobPositionService";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 },
    );
  }
}
