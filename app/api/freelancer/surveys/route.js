import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import {
  getSurveysByFreelancer,
  createSurvey,
} from "@/features/freelancer/surveys/services/surveyService";

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const surveys = await getSurveysByFreelancer(clerkUser.id);
    return NextResponse.json(surveys);
  } catch (error) {
    console.error("GET /api/freelancer/surveys error:", error?.message, error);
    const status = error?.message === "Freelancer access only" ? 403 : 500;
    return NextResponse.json(
      { error: error?.message || "Failed to fetch surveys" },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const survey = await createSurvey(clerkUser.id, body);
    return NextResponse.json(survey, { status: 201 });
  } catch (error) {
    console.error("POST /api/freelancer/surveys error:", error?.message, error);
    const badRequestMessages = [
      "Survey title is required",
      "Survey questions must be an array",
      "Survey must include at least one question",
      "Each question must be an object",
      "Invalid question type",
      "Question label is required",
      "Choice questions require at least one option",
    ];
    const status = error?.message === "Freelancer access only"
      ? 403
      : badRequestMessages.includes(error?.message)
        ? 400
        : 500;

    return NextResponse.json(
      { error: error?.message || "Failed to create survey" },
      { status },
    );
  }
}
