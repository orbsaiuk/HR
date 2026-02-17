import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserByClerkId,
  createUser,
  updateUser,
} from "@/features/auth/services/userService";
import {
  getOrganizationByClerkOrgId,
  addTeamMemberToOrg,
} from "@/features/organizations/services/organizationService";
import {
  getInviteByEmail,
  markInviteJoined,
} from "@/features/team-member-management/services/teamMemberManagementService";

/**
 * Get the user's organization by their Clerk membership.
 * Returns the Sanity organization document or undefined if not a member of any org.
 */
async function getUserOrganization(clerkUserId) {
  try {
    const clerk = await clerkClient();
    const memberships = await clerk.users.getOrganizationMembershipList({
      userId: clerkUserId,
    });
    if (memberships?.data?.length === 1) {
      const clerkOrgId = memberships.data[0].organization.id;
      const sanityOrg = await getOrganizationByClerkOrgId(clerkOrgId);
      if (sanityOrg) {
        return sanityOrg;
      }
    }
  } catch (err) {
    console.error("Failed to resolve org for user:", err);
  }
  return undefined;
}

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = user.emailAddresses[0]?.emailAddress || "";
  const role = user.publicMetadata?.role;

  // 1. Ensure user document exists in Sanity
  let sanityUser = await getUserByClerkId(user.id);

  if (!sanityUser) {
    try {
      sanityUser = await createUser({
        clerkId: user.id,
        name: user.fullName || "",
        email: userEmail,
        avatar: user.imageUrl,
      });
    } catch (err) {
      console.error("Failed to create user in Sanity:", err);
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
  } else {
    // Update avatar and other fields if they've changed
    const updates = {};
    if (user.imageUrl && sanityUser.avatar !== user.imageUrl) {
      updates.avatar = user.imageUrl;
    }
    if (user.fullName && sanityUser.name !== user.fullName) {
      updates.name = user.fullName;
    }
    if (userEmail && sanityUser.email !== userEmail) {
      updates.email = userEmail;
    }
    if (Object.keys(updates).length > 0) {
      await updateUser(sanityUser._id, updates);
    }
  }

  // 2. Get the user's organization from Clerk membership
  const org = await getUserOrganization(user.id);

  if (!org) {
    // User is not a member of any organization yet
    return NextResponse.json({ success: true });
  }

  // 3. Check for pending invite in this organization
  const invite = userEmail ? await getInviteByEmail(userEmail, org._id) : null;

  // 4. Determine if this user should be added as a team member
  const shouldAddTeamMember =
    role === "teamMember" ||
    role === "teacher" ||
    (invite && invite.status === "pending");

  if (shouldAddTeamMember) {
    // Check if user is already a team member in this org's embedded array
    const isAlreadyMember = org.teamMembers?.some(
      (tm) => tm.user?._ref === sanityUser._id,
    );

    if (!isAlreadyMember) {
      // Add user as a team member to the org's embedded array
      await addTeamMemberToOrg(org._id, sanityUser._id, "recruiter");

      // Update user role in Clerk if needed
      if (role !== "teamMember") {
        const clerk = await clerkClient();
        await clerk.users.updateUserMetadata(user.id, {
          publicMetadata: {
            role: "teamMember",
          },
        });
      }

      // If there's a pending invite, mark it as joined
      if (invite && invite.status === "pending") {
        await markInviteJoined(userEmail, sanityUser._id, org._id);
      }
    }
  }

  return NextResponse.json({ success: true });
}
