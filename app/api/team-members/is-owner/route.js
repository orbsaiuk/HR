import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";

export async function GET() {
  try {
    const { teamMember } = await resolveOrgContext();
    // Check if user has the admin role
    return NextResponse.json({ isOwner: teamMember.roleKey === ADMIN_ROLE_KEY });
  } catch (error) {
    console.error("Error checking owner status:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to check owner status" },
      { status },
    );
  }
}
