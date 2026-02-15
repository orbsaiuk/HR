import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { careerService } from "@/features/careers/services/careerService";

/**
 * POST /api/careers/[id]/apply — Submit an application (requires auth)
 */
export async function POST(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to apply" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { answers, formId } = body;

    // Look up Sanity user by Clerk ID
    const sanityUser = await client.fetch(
      `*[_type == "user" && clerkId == $clerkId][0]{ _id }`,
      { clerkId: user.id },
    );

    if (!sanityUser) {
      return NextResponse.json(
        { error: "User profile not found. Please sign in again." },
        { status: 400 },
      );
    }

    // Fetch the form to get field metadata for structuring answers
    let processedAnswers = [];
    if (formId && answers && typeof answers === "object") {
      const form = await client.fetch(
        `*[_type == "form" && _id == $formId][0]{ fields }`,
        { formId: formId },
      );

      processedAnswers = Object.entries(answers).map(([key, value]) => {
        const field = form?.fields?.find((f) => f._key === key);
        const fieldType = field?.type || "text";
        const fieldLabel = field?.label || "Untitled Field";

        let processedValue = value;
        if (typeof value === "object" && value !== null) {
          processedValue = JSON.stringify(value);
        } else {
          processedValue = String(value ?? "");
        }

        return {
          _key: key,
          fieldId: key,
          fieldType,
          fieldLabel,
          value: processedValue,
        };
      });
    }

    const application = await careerService.submitApplication({
      jobPositionId: id,
      applicantId: sanityUser._id,
      formId,
      answers: processedAnswers,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/careers/[id]/apply error:", error);

    if (error.message?.includes("already applied")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/careers/[id]/apply — Check if the current user already applied
 */
export async function GET(request, { params }) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ alreadyApplied: false }, { status: 200 });
    }

    const { id } = await params;

    const sanityUser = await client.fetch(
      `*[_type == "user" && clerkId == $clerkId][0]{ _id }`,
      { clerkId: user.id },
    );

    if (!sanityUser) {
      return NextResponse.json({ alreadyApplied: false }, { status: 200 });
    }

    const alreadyApplied = await client.fetch(
      `count(*[_type == "application" && jobPosition._ref == $positionId && applicant._ref == $userId]) > 0`,
      { positionId: id, userId: sanityUser._id },
    );

    return NextResponse.json({ alreadyApplied: Boolean(alreadyApplied) });
  } catch (error) {
    console.error("GET /api/careers/[id]/apply error:", error);
    return NextResponse.json(
      { error: "Failed to check application status" },
      { status: 500 },
    );
  }
}
