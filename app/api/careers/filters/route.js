import { NextResponse } from "next/server";
import { careerService } from "@/features/public/careers/services/careerService";

/**
 * GET /api/careers/filters — Get unique departments and locations for filters
 */
export async function GET() {
  try {
    const [departments, locations] = await Promise.all([
      careerService.getDepartments(),
      careerService.getLocations(),
    ]);

    return NextResponse.json({ departments, locations });
  } catch (error) {
    console.error("GET /api/careers/filters error:", error);
    return NextResponse.json(
      { error: "Failed to fetch filters" },
      { status: 500 },
    );
  }
}
