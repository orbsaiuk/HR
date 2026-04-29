import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getSurveyResponsesForOwner } from "@/features/freelancer/surveys/services/surveyResponseService";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responses = await getSurveyResponsesForOwner(clerkUser.id, id);
    return NextResponse.json(responses);
  } catch (error) {
    console.error(
      "GET /api/freelancer/surveys/[id]/responses error:",
      error?.message,
      error,
    );
    return NextResponse.json(
      { error: error?.message || "Failed to fetch survey responses" },
      { status: error?.message === "Freelancer access only" ? 403 : 500 },
    );
  }
}
