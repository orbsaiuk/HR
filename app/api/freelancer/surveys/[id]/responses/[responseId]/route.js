import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import {
  deleteSurveyResponse,
  getSurveyResponseByIdForOwner,
} from "@/features/freelancer/surveys/services/surveyResponseService";

function statusForError(error) {
  if (error?.message === "Freelancer access only") return 403;
  if (error?.message === "Survey response not found") return 404;
  return 500;
}

export async function GET(_request, { params }) {
  try {
    const { responseId } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await getSurveyResponseByIdForOwner(
      clerkUser.id,
      responseId,
    );
    if (!response) {
      return NextResponse.json(
        { error: "Survey response not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(
      "GET /api/freelancer/surveys/[id]/responses/[responseId] error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to fetch survey response" },
      { status: statusForError(error) },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { responseId } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteSurveyResponse(clerkUser.id, responseId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "DELETE /api/freelancer/surveys/[id]/responses/[responseId] error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to delete survey response" },
      { status: statusForError(error) },
    );
  }
}
