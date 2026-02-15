import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getInvites,
  createInvite,
} from "@/features/team-member-management/services/teamMemberManagementService";

export async function GET() {
  try {
    const { orgId, orgRole } = await resolveOrgContext();

    // Only admins can view invites
    if (orgRole !== "org:admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invites = await getInvites(orgId);
    return NextResponse.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch invites" },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const { orgId, orgRole, teamMember } = await resolveOrgContext();

    // Only admins can create invites
    if (orgRole !== "org:admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const invite = await createInvite(email, teamMember._id, orgId);
    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Error creating invite:", error);
    const httpStatus = error.message?.includes("already exists") ? 409 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to create invite" },
      { status: error.status || httpStatus },
    );
  }
}
