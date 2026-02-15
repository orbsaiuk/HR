import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { userProfileService } from "@/features/user-profile/services";

/**
 * GET /api/user/profile/completeness — Get profile completion status for the current user
 */
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const completeness = await userProfileService.getProfileCompleteness(
            user.id,
        );

        if (!completeness) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(completeness);
    } catch (error) {
        console.error("GET /api/user/profile/completeness error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile completeness" },
            { status: 500 },
        );
    }
}
