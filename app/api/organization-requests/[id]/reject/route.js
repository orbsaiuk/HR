import { NextResponse } from "next/server";
import { rejectRequest } from "@/features/organization-requests/services/orgRequestService";

/**
 * POST /api/organization-requests/[id]/reject — Reject an organization request
 * Called from Sanity Studio custom document action.
 */
export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        if (!body.reason) {
            return NextResponse.json(
                { error: "Rejection reason is required" },
                { status: 400 },
            );
        }

        const adminInfo = {
            name: body.adminName || "Studio Admin",
            email: body.adminEmail || undefined,
        };

        const result = await rejectRequest(id, body.reason, adminInfo);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error rejecting organization request:", error);
        const status = error.status || 500;
        return NextResponse.json(
            {
                error:
                    error.message || "Failed to reject organization request",
            },
            { status },
        );
    }
}
