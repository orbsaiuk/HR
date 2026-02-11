import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { NextResponse } from "next/server";
import {
  getInviteByEmail,
  markInviteJoined,
} from "@/features/team-member-management/services/teamMemberManagementService";

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user.emailAddresses[0]?.emailAddress || "";
  const role = user.publicMetadata?.role;

  // Check if user exists in Sanity
  const existingUser = await client.fetch(
    `*[_type == "user" && clerkId == $clerkId][0]`,
    { clerkId: user.id },
  );

  if (!existingUser) {
    // Create user in Sanity
    await client.create({
      _type: "user",
      clerkId: user.id,
      name: user.fullName || "",
      email: userEmail,
      avatar: user.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Check if there's a pending team member invite for this email
  const invite = userEmail ? await getInviteByEmail(userEmail) : null;

  // Ensure team member exists for invited or role-based access
  const existingTeamMember = await client.fetch(
    `*[_type == "teamMember" && clerkId == $clerkId][0]`,
    { clerkId: user.id },
  );

  const shouldCreateTeamMember =
    !existingTeamMember &&
    (role === "teamMember" ||
      role === "teacher" ||
      (invite && invite.status === "pending"));

  if (shouldCreateTeamMember) {
    const legacyTeacher = await client.fetch(
      `*[_type == "teacher" && clerkId == $clerkId][0]`,
      { clerkId: user.id },
    );

    const teamMember = await client.create({
      _type: "teamMember",
      clerkId: user.id,
      name: legacyTeacher?.name || user.fullName || "",
      email: legacyTeacher?.email || userEmail,
      avatar: legacyTeacher?.avatar || user.imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (role !== "teamMember") {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: "teamMember",
        },
      });
    }

    if (invite && invite.status === "pending") {
      await markInviteJoined(userEmail, teamMember._id);
    }
  }

  return NextResponse.json({ success: true });
}
