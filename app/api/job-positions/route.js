import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getJobPositions,
  createJobPosition,
} from "@/features/job-positions/services/jobPositionService";

export async function GET() {
  try {
    const { orgId } = await resolveOrgContext();
    const positions = await getJobPositions(orgId);
    return NextResponse.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    const status = error.status || 500;
    return NextResponse.json({ error: error.message }, { status });
  }
}

export async function POST(request) {
  try {
    const { orgId } = await resolveOrgContext();
    const input = await request.json();
    const position = await createJobPosition(input, orgId);
    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to create position" },
      { status },
    );
  }
}
