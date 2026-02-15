import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/features/auth/services/userService";
import {
    createRequest,
    getRequestsByUser,
} from "@/features/organization-requests/services/orgRequestService";

/**
 * POST /api/organization-requests — Submit a new organization registration request
 */
export async function POST(request) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const sanityUser = await getUserByClerkId(user.id);
        if (!sanityUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const data = await request.json();

        // Validate required fields
        if (!data.orgName || !data.contactEmail) {
            return NextResponse.json(
                { error: "Organization name and contact email are required" },
                { status: 400 },
            );
        }

        const result = await createRequest(sanityUser._id, data);
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating organization request:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to create organization request" },
            { status },
        );
    }
}

/**
 * GET /api/organization-requests — List the current user's organization requests
 */
export async function GET() {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const sanityUser = await getUserByClerkId(user.id);
        if (!sanityUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 },
            );
        }

        const requests = await getRequestsByUser(sanityUser._id);
        return NextResponse.json(requests);
    } catch (error) {
        console.error("Error fetching organization requests:", error);
        const status = error.status || 500;
        return NextResponse.json(
            {
                error:
                    error.message || "Failed to fetch organization requests",
            },
            { status },
        );
    }
}
