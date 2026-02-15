import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "@/features/applications/services/applicationService";

export async function GET(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;

    const application = await getApplicationById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch application" },
      { status },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const input = await request.json();
    const application = await updateApplication(id, input);
    return NextResponse.json(application);
  } catch (error) {
    console.error("Error updating application:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update application" },
      { status },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    await deleteApplication(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting application:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to delete application" },
      { status },
    );
  }
}
