import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getRequestById } from "@/features/organization-requests/services/orgRequestService";

/**
 * GET /api/organization-requests/[id] — Get a single organization request by ID
 */
export async function GET(request, { params }) {
    try {
        const user = await currentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;
        const orgRequest = await getRequestById(id);

        if (!orgRequest) {
            return NextResponse.json(
                { error: "Request not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(orgRequest);
    } catch (error) {
        console.error("Error fetching organization request:", error);
        const status = error.status || 500;
        return NextResponse.json(
            {
                error:
                    error.message || "Failed to fetch organization request",
            },
            { status },
        );
    }
}
