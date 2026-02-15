import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getFormById,
  updateForm,
  deleteForm,
} from "@/features/forms/services/formService";
import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { formsQueries } from "@/sanity/queries";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const form = await getFormById(id);
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Check if current user has already submitted (for public form view)
    const user = await currentUser();
    if (user) {
      const sanityUser = await client.fetch(formsQueries.getUserByClerkId, {
        clerkId: user.id,
      });

      if (sanityUser) {
        const existingResponse = await client.fetch(
          formsQueries.checkUserResponse,
          { formId: id, userId: sanityUser._id },
        );
        form.userHasSubmitted = !!existingResponse;
      }
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const input = await request.json();
    const form = await updateForm(id, input);
    return NextResponse.json(form);
  } catch (error) {
    console.error("Error updating form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update form" },
      { status },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    await deleteForm(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting form:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to delete form" },
      { status },
    );
  }
}
