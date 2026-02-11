import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { updateApplicationStatus } from "@/features/applications/services/applicationService";

const VALID_STATUSES = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, notes, rejectionReason, rating } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const application = await updateApplicationStatus(id, status, {
      notes,
      rejectionReason,
      rating,
    });
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update status" },
      { status: 500 },
    );
  }
}
