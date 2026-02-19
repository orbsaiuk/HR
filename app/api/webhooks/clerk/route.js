import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {
  getOrganizationByClerkOrgId,
  createOrganization,
  updateOrganization,
  getTeamMemberByClerkAndOrg,
  addTeamMemberToOrg,
  updateTeamMemberRole,
  removeTeamMemberFromOrg,
} from "@/features/organizations/services/organizationService";
import {
  getUserByClerkId,
  createUser,
  updateUser,
} from "@/features/auth/services/userService";
import { seedDefaultRoles } from "@/features/roles/services/rolesService";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";
import {
  getInviteByEmail,
} from "@/features/team-member-management/services/teamMemberManagementService";


function mapClerkRoleToRoleKey(clerkRole) {
  switch (clerkRole) {
    case "org:admin":
      return ADMIN_ROLE_KEY; // "admin"
    case "org:member":
    default:
      return "viewer";
  }
}


async function verifyWebhook(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("CLERK_WEBHOOK_SECRET environment variable is not set");
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new Error("Missing svix headers");
  }

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  return wh.verify(body, {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  });
}

/**
 * Handle organization.created event.
 * Creates a new organization document in Sanity with initialized teamMembers and invites arrays.
 */
async function handleOrganizationCreated(data) {
  const existing = await getOrganizationByClerkOrgId(data.id);

  if (existing) {
    return { message: "Organization already exists", id: existing._id };
  }

  const org = await createOrganization(data);

  // Seed default roles for the new organization
  await seedDefaultRoles(org._id);

  return { message: "Organization created", id: org._id };
}

/**
 * Handle organization.updated event.
 * Updates the existing organization document in Sanity.
 */
async function handleOrganizationUpdated(data) {
  const existing = await getOrganizationByClerkOrgId(data.id);

  if (!existing) {
    // Organization doesn't exist yet, create it
    return handleOrganizationCreated(data);
  }

  await updateOrganization(existing._id, {
    name: data.name,
    slug: { _type: "slug", current: data.slug },
  });

  return { message: "Organization updated", id: existing._id };
}

/**
 * Handle organizationMembership.created event.
 * Finds the user document and adds them to the organization's embedded teamMembers array.
 */
async function handleMembershipCreated(data) {
  const clerkUserId = data.public_user_data?.user_id;
  const clerkOrgId = data.organization?.id;
  const clerkRole = data.role;

  if (!clerkUserId || !clerkOrgId) {
    return { message: "Missing user or org data" };
  }

  // Find the organization in Sanity
  const organization = await getOrganizationByClerkOrgId(clerkOrgId);

  if (!organization) {
    return { message: "Organization not found in Sanity", clerkOrgId };
  }

  // Find the user document in Sanity
  let userDoc = await getUserByClerkId(clerkUserId);

  if (!userDoc) {
    // Create user document if it doesn't exist yet
    const userData = data.public_user_data;
    userDoc = await createUser({
      clerkId: clerkUserId,
      name:
        [userData?.first_name, userData?.last_name].filter(Boolean).join(" ") ||
        "",
      email: userData?.identifier || "",
      avatar: userData?.image_url || undefined,
    });
  }

  // Determine the role: check for a pending invite first, then fall back to Clerk role mapping
  const userEmail = data.public_user_data?.identifier || userDoc?.email;
  let roleKey = mapClerkRoleToRoleKey(clerkRole);

  if (userEmail && clerkRole !== "org:admin") {
    const invite = await getInviteByEmail(userEmail, organization._id);
    if (invite && invite.roleKey) {
      roleKey = invite.roleKey;
    }
  }

  // Check if user is already a team member in this org's embedded array
  const existingMember = await getTeamMemberByClerkAndOrg(
    clerkUserId,
    organization._id,
  );

  if (existingMember) {
    // Update role if needed
    await updateTeamMemberRole(
      organization._id,
      existingMember._key,
      roleKey,
    );

    return {
      message: "Team member already exists, role updated",
      key: existingMember._key,
    };
  }

  // Add new member to the organization's embedded teamMembers array
  await addTeamMemberToOrg(
    organization._id,
    userDoc._id,
    roleKey,
  );

  return { message: "Team member added to organization", orgId: organization._id };
}

/**
 * Handle organizationMembership.updated event.
 * Updates the team member's role in the organization's embedded teamMembers array.
 */
async function handleMembershipUpdated(data) {
  const clerkUserId = data.public_user_data?.user_id;
  const clerkOrgId = data.organization?.id;
  const clerkRole = data.role;

  if (!clerkUserId || !clerkOrgId) {
    return { message: "Missing user or org data" };
  }

  const organization = await getOrganizationByClerkOrgId(clerkOrgId);

  if (!organization) {
    return { message: "Organization not found" };
  }

  const member = await getTeamMemberByClerkAndOrg(
    clerkUserId,
    organization._id,
  );

  if (!member) {
    return { message: "Team member not found" };
  }

  await updateTeamMemberRole(
    organization._id,
    member._key,
    mapClerkRoleToRoleKey(clerkRole),
  );

  return { message: "Team member role updated", key: member._key };
}

/**
 * Handle organizationMembership.deleted event.
 * Removes the team member entry from the organization's embedded teamMembers array.
 */
async function handleMembershipDeleted(data) {
  const clerkUserId = data.public_user_data?.user_id;
  const clerkOrgId = data.organization?.id;

  if (!clerkUserId || !clerkOrgId) {
    return { message: "Missing user or org data" };
  }

  const organization = await getOrganizationByClerkOrgId(clerkOrgId);

  if (!organization) {
    return { message: "Organization not found" };
  }

  // Find the user document to get their _id for removal
  const userDoc = await getUserByClerkId(clerkUserId);

  if (!userDoc) {
    return { message: "User not found in Sanity" };
  }

  // Remove the team member entry from the embedded array
  await removeTeamMemberFromOrg(organization._id, userDoc._id);

  return { message: "Team member removed from organization", orgId: organization._id };
}

/**
 * Handle user.created event.
 * Creates a new user document in Sanity when a user signs up via Clerk.
 */
async function handleUserCreated(data) {
  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address || "";
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "";
  const avatar = data.image_url || undefined;

  // Check if user already exists (idempotency)
  const existing = await getUserByClerkId(clerkId);
  if (existing) {
    return { message: "User already exists in Sanity", id: existing._id };
  }

  const userDoc = await createUser({ clerkId, name, email, avatar });
  return { message: "User created in Sanity", id: userDoc._id };
}

/**
 * Handle user.updated event.
 * Updates the existing user document in Sanity when user profile changes in Clerk.
 */
async function handleUserUpdated(data) {
  const clerkId = data.id;
  const email = data.email_addresses?.[0]?.email_address || "";
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "";
  const avatar = data.image_url || undefined;

  let userDoc = await getUserByClerkId(clerkId);

  if (!userDoc) {
    // User doesn't exist yet — create it
    userDoc = await createUser({ clerkId, name, email, avatar });
    return { message: "User created in Sanity (via user.updated)", id: userDoc._id };
  }

  // Update fields that have changed
  const updates = {};
  if (name && userDoc.name !== name) updates.name = name;
  if (email && userDoc.email !== email) updates.email = email;
  if (avatar && userDoc.avatar !== avatar) updates.avatar = avatar;

  if (Object.keys(updates).length > 0) {
    await updateUser(userDoc._id, updates);
  }

  return { message: "User updated in Sanity", id: userDoc._id };
}

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const { type, data } = evt;

    let result;

    switch (type) {
      case "user.created":
        result = await handleUserCreated(data);
        break;
      case "user.updated":
        result = await handleUserUpdated(data);
        break;
      case "organization.created":
        result = await handleOrganizationCreated(data);
        break;
      case "organization.updated":
        result = await handleOrganizationUpdated(data);
        break;
      case "organizationMembership.created":
        result = await handleMembershipCreated(data);
        break;
      case "organizationMembership.updated":
        result = await handleMembershipUpdated(data);
        break;
      case "organizationMembership.deleted":
        result = await handleMembershipDeleted(data);
        break;
      default:
        result = { message: `Unhandled event type: ${type}` };
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 400 },
    );
  }
}
