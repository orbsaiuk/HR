import { NextResponse } from "next/server";
import { careerService } from "@/features/careers/services/careerService";

/**
 * GET /api/careers — List all open positions (public, no auth)
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const department = searchParams.get("department") || "";
    const location = searchParams.get("location") || "";
    const type = searchParams.get("type") || "";

    let positions = await careerService.getPublicPositions();

    // Apply client-side filtering (Sanity GROQ handles status == "open")
    if (search) {
      const q = search.toLowerCase();
      positions = positions.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.department?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q),
      );
    }

    if (department) {
      positions = positions.filter(
        (p) => p.department?.toLowerCase() === department.toLowerCase(),
      );
    }

    if (location) {
      positions = positions.filter(
        (p) => p.location?.toLowerCase() === location.toLowerCase(),
      );
    }

    if (type) {
      positions = positions.filter((p) => p.type === type);
    }

    return NextResponse.json(positions);
  } catch (error) {
    console.error("GET /api/careers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 },
    );
  }
}
