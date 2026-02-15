import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getResponsesByFormId } from "@/features/responses/services/responseService";

export async function GET(request) {
  try {
    const { orgId } = await resolveOrgContext();
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("formId");

    if (!formId) {
      return NextResponse.json(
        { error: "formId is required" },
        { status: 400 },
      );
    }

    const responses = await getResponsesByFormId(formId);
    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status },
    );
  }
}
