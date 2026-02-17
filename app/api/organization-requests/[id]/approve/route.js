import { NextResponse } from "next/server";
import { approveRequest } from "@/features/organization-requests/services/orgRequestService";

/**
 * POST /api/organization-requests/[id]/approve — Approve an organization request
 * Called from Sanity Studio custom document action.
 */
export async function POST(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json().catch(() => ({}));

        const adminInfo = {
            name: body.adminName || "Studio Admin",
            email: body.adminEmail || undefined,
        };

        const orgSlug = body.orgSlug || undefined;

        const result = await approveRequest(id, adminInfo, orgSlug);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error approving organization request:", error);
        const status = error.status || 500;
        return NextResponse.json(
            {
                error:
                    error.message || "Failed to approve organization request",
            },
            { status },
        );
    }
}
