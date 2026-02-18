import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getUserPermissions } from "@/shared/lib/permissionChecker";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";

/**
 * GET /api/user/permissions — Get the current user's permissions based on their role
 * Returns the user's role info and an array of permission strings.
 */
export async function GET() {
    try {
        const context = await resolveOrgContext();
        const permissions = getUserPermissions(context);

        const roleKey = context.teamMember?.roleKey;
        const role = roleKey === ADMIN_ROLE_KEY
            ? { _key: ADMIN_ROLE_KEY, name: "Admin" }
            : context.organization?.roles?.find((r) => r._key === roleKey) || null;

        return NextResponse.json({
            permissions,
            roleKey,
            roleName: role?.name || null,
        });
    } catch (error) {
        console.error("Error fetching user permissions:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch permissions" },
            { status },
        );
    }
}
