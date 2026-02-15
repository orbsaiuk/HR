import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries";

/**
 * Map Clerk organization roles to application roles.
 * @param {string} clerkRole - The Clerk org role (e.g. "org:admin", "org:member")
 * @returns {string} The mapped application role
 */
function mapClerkRoleToAppRole(clerkRole) {
    switch (clerkRole) {
        case "org:admin":
            return "admin";
        case "org:member":
        default:
            return "recruiter";
    }
}

/**
 * Verify the incoming webhook request using svix.
 * @param {Request} req - The incoming request
 * @returns {Promise<object>} The verified webhook payload
 */
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
 * Creates a new organization document in Sanity.
 */
async function handleOrganizationCreated(data) {
    const existing = await client.fetch(organizationQueries.getByClerkOrgId, {
        clerkOrgId: data.id,
    });

    if (existing) {
        return { message: "Organization already exists", id: existing._id };
    }

    const org = await client.create({
        _type: "organization",
        name: data.name,
        slug: { _type: "slug", current: data.slug },
        clerkOrgId: data.id,
        description: data.public_metadata?.description || "",
        website: data.public_metadata?.website || undefined,
        settings: {
            brandColor: data.public_metadata?.brandColor || undefined,
            careerPageEnabled: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    return { message: "Organization created", id: org._id };
}

/**
 * Handle organization.updated event.
 * Updates the existing organization document in Sanity.
 */
async function handleOrganizationUpdated(data) {
    const existing = await client.fetch(organizationQueries.getByClerkOrgId, {
        clerkOrgId: data.id,
    });

    if (!existing) {
        // Organization doesn't exist yet, create it
        return handleOrganizationCreated(data);
    }

    await client
        .patch(existing._id)
        .set({
            name: data.name,
            slug: { _type: "slug", current: data.slug },
            updatedAt: new Date().toISOString(),
        })
        .commit();

    return { message: "Organization updated", id: existing._id };
}

/**
 * Handle organizationMembership.created event.
 * Creates or links a teamMember with the organization reference and role.
 */
async function handleMembershipCreated(data) {
    const clerkUserId = data.public_user_data?.user_id;
    const clerkOrgId = data.organization?.id;
    const clerkRole = data.role;

    if (!clerkUserId || !clerkOrgId) {
        return { message: "Missing user or org data" };
    }

    // Find the organization in Sanity
    const organization = await client.fetch(
        organizationQueries.getByClerkOrgId,
        { clerkOrgId },
    );

    if (!organization) {
        return { message: "Organization not found in Sanity", clerkOrgId };
    }

    // Check if team member already exists for this user + org
    const existingMember = await client.fetch(
        organizationQueries.getTeamMemberByClerkAndOrg,
        { clerkId: clerkUserId, orgId: organization._id },
    );

    if (existingMember) {
        // Update role if needed
        await client
            .patch(existingMember._id)
            .set({
                role: mapClerkRoleToAppRole(clerkRole),
                updatedAt: new Date().toISOString(),
            })
            .commit();

        return { message: "Team member already exists, role updated", id: existingMember._id };
    }

    // Create new team member linked to the organization
    const userData = data.public_user_data;
    const teamMember = await client.create({
        _type: "teamMember",
        clerkId: clerkUserId,
        name:
            [userData?.first_name, userData?.last_name]
                .filter(Boolean)
                .join(" ") || "",
        email: userData?.identifier || "",
        avatar: userData?.image_url || undefined,
        organization: {
            _type: "reference",
            _ref: organization._id,
        },
        role: mapClerkRoleToAppRole(clerkRole),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    return { message: "Team member created", id: teamMember._id };
}

/**
 * Handle organizationMembership.updated event.
 * Updates the teamMember role.
 */
async function handleMembershipUpdated(data) {
    const clerkUserId = data.public_user_data?.user_id;
    const clerkOrgId = data.organization?.id;
    const clerkRole = data.role;

    if (!clerkUserId || !clerkOrgId) {
        return { message: "Missing user or org data" };
    }

    const organization = await client.fetch(
        organizationQueries.getByClerkOrgId,
        { clerkOrgId },
    );

    if (!organization) {
        return { message: "Organization not found" };
    }

    const member = await client.fetch(
        organizationQueries.getTeamMemberByClerkAndOrg,
        { clerkId: clerkUserId, orgId: organization._id },
    );

    if (!member) {
        return { message: "Team member not found" };
    }

    await client
        .patch(member._id)
        .set({
            role: mapClerkRoleToAppRole(clerkRole),
            updatedAt: new Date().toISOString(),
        })
        .commit();

    return { message: "Team member role updated", id: member._id };
}

/**
 * Handle organizationMembership.deleted event.
 * Removes the organization link from the teamMember.
 */
async function handleMembershipDeleted(data) {
    const clerkUserId = data.public_user_data?.user_id;
    const clerkOrgId = data.organization?.id;

    if (!clerkUserId || !clerkOrgId) {
        return { message: "Missing user or org data" };
    }

    const organization = await client.fetch(
        organizationQueries.getByClerkOrgId,
        { clerkOrgId },
    );

    if (!organization) {
        return { message: "Organization not found" };
    }

    const member = await client.fetch(
        organizationQueries.getTeamMemberByClerkAndOrg,
        { clerkId: clerkUserId, orgId: organization._id },
    );

    if (!member) {
        return { message: "Team member not found" };
    }

    await client
        .patch(member._id)
        .unset(["organization", "role"])
        .set({ updatedAt: new Date().toISOString() })
        .commit();

    return { message: "Team member org link removed", id: member._id };
}

export async function POST(req) {
    try {
        const evt = await verifyWebhook(req);
        const { type, data } = evt;

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
