import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { userProfileService } from "@/features/user-profile/services";

/**
 * GET /api/user/profile — Get the current user's full profile
 */
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const profile = await userProfileService.getFullProfile(user.id);

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error("GET /api/user/profile error:", error);
        return NextResponse.json(
            { error: "Failed to fetch profile" },
            { status: 500 },
        );
    }
}

/**
 * PUT /api/user/profile — Update the current user's profile fields
 */
export async function PUT(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const sanityUser = await getUserByClerkId(user.id);
        if (!sanityUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const data = await request.json();
        const updated = await userProfileService.updateProfile(
            sanityUser._id,
            data,
        );

        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /api/user/profile error:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 },
        );
    }
}
