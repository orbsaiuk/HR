import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getUserPermissions } from "@/shared/lib/permissionChecker";

/**
 * GET /api/team-members/my-permissions — Get the current user's permissions
 *
 * Returns { permissions: string[] } — the list of permission keys the user has
 * based on their role in the current organization.
 */
export async function GET() {
    try {
        const context = await resolveOrgContext();
        const permissions = getUserPermissions(context);

        return NextResponse.json({ permissions });
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch permissions" },
            { status },
        );
    }
}
