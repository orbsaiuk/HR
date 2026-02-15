import { NextResponse } from "next/server";
import { careerService } from "@/features/careers/services/careerService";

/**
 * GET /api/careers/[id] — Get a single open position (public)
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const position = await careerService.getPublicPositionById(id);

    if (!position) {
      return NextResponse.json(
        { error: "Position not found or no longer open" },
        { status: 404 }
      );
    }

    return NextResponse.json(position);
  } catch (error) {
    console.error("GET /api/careers/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch position" },
      { status: 500 }
    );
  }
}
