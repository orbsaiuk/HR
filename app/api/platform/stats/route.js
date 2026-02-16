import { NextResponse } from "next/server";
import { getPlatformStats } from "@/features/organizations/services/organizationService";

/**
 * GET /api/platform/stats — Get platform-wide stats for the landing page
 */
export async function GET() {
    try {
        const stats = await getPlatformStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error("GET /api/platform/stats error:", error);
        return NextResponse.json(
            { error: "Failed to fetch platform stats" },
            { status: 500 },
        );
    }
}
