import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getFormById,
  getUserByClerkId,
  getExistingResponse,
} from "@/features/forms/services/formService";
import {
  createResponse,
  processFormAnswers,
} from "@/features/responses/services/responseService";

export async function POST(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const answersJson = formData.get("answers");
    const answers = JSON.parse(answersJson);
    const { id: formId } = await params;

    // Get form
    const form = await getFormById(formId);

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    // Get user from Sanity
    const sanityUser = await getUserByClerkId(user.id);

    if (!sanityUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already submitted a response
    const existingResponse = await getExistingResponse(formId, sanityUser._id);

    if (existingResponse) {
      return NextResponse.json(
        { error: "You have already submitted a response to this form" },
        { status: 400 },
      );
    }

    // Process answers and upload files
    const processedAnswers = await processFormAnswers(
      answers,
      form.fields,
      formData,
    );

    // Create response
    const response = await createResponse({
      formId,
      userId: sanityUser._id,
      answers: processedAnswers,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit form", details: error.message },
      { status: 500 },
    );
  }
}
