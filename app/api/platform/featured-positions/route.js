import { NextResponse } from "next/server";
import { getFeaturedPositions } from "@/features/shared/organizations/services/organizationService";

/**
 * GET /api/platform/featured-positions — Get recent open positions for the landing page
 */
export async function GET() {
    try {
        const positions = await getFeaturedPositions();
        return NextResponse.json(positions);
    } catch (error) {
        console.error("GET /api/platform/featured-positions error:", error);
        return NextResponse.json(
            { error: "Failed to fetch featured positions" },
            { status: 500 },
        );
    }
}
