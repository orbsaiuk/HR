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
} from "@/features/auth/services/userService";


function mapClerkRoleToAppRole(clerkRole) {
  switch (clerkRole) {
    case "org:admin":
      return "admin";
    case "org:member":
    default:
      return "recruiter";
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
      mapClerkRoleToAppRole(clerkRole),
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
    mapClerkRoleToAppRole(clerkRole),
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
    mapClerkRoleToAppRole(clerkRole),
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

export async function POST(req) {
  try {
    const evt = await verifyWebhook(req);
    const { type, data } = evt;

    console.log(`[Clerk Webhook] Received event: ${type}`, JSON.stringify(data, null, 2));

    let result;

    switch (type) {
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
      case "user.created":
      case "user.updated":
        console.log(`[Clerk Webhook] >>> ${type} event received but NO HANDLER exists. User data:`, {
          id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
        });
        result = { message: `DEBUG: ${type} received but not handled — this is the bug!` };
        break;
      default:
        console.log(`[Clerk Webhook] Unhandled event type: ${type}`);
        result = { message: `Unhandled event type: ${type}` };
    }

    console.log(`[Clerk Webhook] Result for ${type}:`, result);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 400 },
    );
  }
}
