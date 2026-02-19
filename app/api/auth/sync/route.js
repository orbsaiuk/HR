import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  getUserByClerkId,
  createUser,
  updateUser,
} from "@/features/auth/services/userService";
import {
  getOrganizationByClerkOrgId,
  getOrganizationByIdWithMembers,
  addTeamMemberToOrg,
} from "@/features/organizations/services/organizationService";
import {
  getInviteByEmail,
  markInviteJoined,
  findPendingInviteByEmail,
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

/**
 * Add a user to a Clerk organization.
 * This triggers the organizationMembership.created webhook which handles Sanity.
 */
async function addUserToClerkOrg(clerkUserId, clerkOrgId) {
  const clerk = await clerkClient();
  await clerk.organizations.createOrganizationMembership({
    organizationId: clerkOrgId,
    userId: clerkUserId,
    role: "org:member",
  });
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

  // 2. Check if user is already a member of a Clerk organization
  let org = await getUserOrganization(user.id);

  // 3. If not in any org, check for pending invites and auto-add to Clerk org
  if (!org && userEmail) {
    const pendingInvite = await findPendingInviteByEmail(userEmail);

    if (pendingInvite) {
      const { orgId: sanityOrgId, orgName, invite } = pendingInvite;

      // Fetch the full org document to get clerkOrgId
      const orgWithClerkId = await getOrganizationByIdWithMembers(sanityOrgId);

      if (orgWithClerkId?.clerkOrgId) {
        try {
          // Add user to Clerk organization
          await addUserToClerkOrg(user.id, orgWithClerkId.clerkOrgId);

          // Now get the Sanity org via Clerk ID
          org = await getOrganizationByClerkOrgId(orgWithClerkId.clerkOrgId);

          console.log(
            `[auth/sync] Added user ${userEmail} to Clerk org "${orgName}" via pending invite`,
          );
        } catch (err) {
          // User might already be a member, or org doesn't exist in Clerk
          console.error(
            "[auth/sync] Failed to add user to Clerk org:",
            err.message,
          );
        }
      }
    }
  }

  if (!org) {
    // User is not a member of any organization yet and has no pending invites
    return NextResponse.json({ success: true });
  }

  // 4. Check for pending invite in this organization
  const invite = userEmail ? await getInviteByEmail(userEmail, org._id) : null;

  // 5. Determine if this user should be added as a team member
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
      // Use the role from the invite if available, otherwise default to "viewer"
      const memberRoleKey = invite?.roleKey || "viewer";
      // Add user as a team member to the org's embedded array
      await addTeamMemberToOrg(org._id, sanityUser._id, memberRoleKey);

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
