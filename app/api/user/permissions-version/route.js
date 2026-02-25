import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { client } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries";

/**
 * GET /api/user/permissions-version
 *
 * Returns the current permissionsVersion for the user's organization.
 * This is a lightweight endpoint — it only fetches a single number field.
 *
 * The frontend checks this on route changes. If the version has changed
 * since the last fetch, it invalidates and re-fetches the full permissions.
 *
 * Returns: { version: number }
 */
export async function GET() {
    try {
        const context = await resolveOrgContext();

        const version = await client.fetch(
            organizationQueries.getPermissionsVersion,
            { orgId: context.orgId },
        );

        return NextResponse.json({ version: version ?? 1 });
    } catch (error) {
        console.error("Error fetching permissions version:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch permissions version" },
            { status },
        );
    }
}
