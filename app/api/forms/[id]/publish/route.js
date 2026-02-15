import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { updateForm } from "@/features/forms/services/formService";

export async function POST(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const form = await updateForm(id, { status: "published" });
    return NextResponse.json(form);
  } catch (error) {
    console.error("Error publishing form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to publish form" },
      { status },
    );
  }
}
