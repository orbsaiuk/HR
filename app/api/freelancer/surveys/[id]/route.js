import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import {
  getSurveyByIdForFreelancer,
  updateSurvey,
  deleteSurvey,
} from "@/features/freelancer/surveys/services/surveyService";

const BAD_REQUEST_MESSAGES = [
  "Survey title is required",
  "Survey questions must be an array",
  "Survey must include at least one question",
  "Each question must be an object",
  "Invalid question type",
  "Question label is required",
  "Choice questions require at least one option",
];

function statusForError(error) {
  if (error?.message === "Freelancer access only") return 403;
  if (error?.message === "Survey not found") return 404;
  if (BAD_REQUEST_MESSAGES.includes(error?.message)) return 400;
  return 500;
}

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const survey = await getSurveyByIdForFreelancer(clerkUser.id, id);
    if (!survey) {
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    return NextResponse.json(survey);
  } catch (error) {
    console.error(
      "GET /api/freelancer/surveys/[id] error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to fetch survey" },
      { status: statusForError(error) },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const survey = await updateSurvey(clerkUser.id, id, body);
    return NextResponse.json(survey);
  } catch (error) {
    console.error(
      "PUT /api/freelancer/surveys/[id] error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to update survey" },
      { status: statusForError(error) },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteSurvey(clerkUser.id, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "DELETE /api/freelancer/surveys/[id] error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to delete survey" },
      { status: statusForError(error) },
    );
  }
}
