import { client } from "@/sanity/client";
import { clerkClient } from "@clerk/nextjs/server";
import { getOrganizationByClerkOrgId } from "@/features/organizations/services/organizationService";
import { getUserByClerkId } from "@/features/auth/services/userService";
import { seedDefaultRoles } from "@/features/roles/services/rolesService";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";
import { sendOrgRequestApprovedEmail } from "@/shared/services/email/orgRequestEmailService";
import {
    fetchRequestById,
    markRequestApproved,
} from "../repositories/orgRequestRepository";

async function createClerkOrganization(request, requestId) {
    const clerk = await clerkClient();
    return clerk.organizations.createOrganization({
        name: request.orgName,
        createdBy: request.requestedBy?.clerkId,
        publicMetadata: {
            description: request.orgDescription || "",
            website: request.orgWebsite || undefined,
            industry: request.orgIndustry || undefined,
            size: request.orgSize || undefined,
            requestId,
        },
    });
}

function resolveOrgSlug(orgSlug, orgName) {
    if (orgSlug) {
        return { _type: "slug", current: orgSlug };
    }
    return {
        _type: "slug",
        current: orgName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    };
}

async function ensureSanityOrganization(clerkOrgId, request, slug) {
    const now = new Date().toISOString();

    // Poll for webhook-created org
    let sanityOrg = null;
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        sanityOrg = await getOrganizationByClerkOrgId(clerkOrgId);
        if (sanityOrg) break;
        await new Promise((r) => setTimeout(r, 1000));
    }

    if (!sanityOrg) {
        // Webhook hasn't fired yet — create the org ourselves
        sanityOrg = await client.create({
            _type: "organization",
            name: request.orgName,
            slug,
            clerkOrgId,
            description: request.orgDescription || "",
            location: request.orgLocation || undefined,
            website: request.orgWebsite || undefined,
            industry: request.orgIndustry || undefined,
            size: request.orgSize || undefined,
            logo: request.orgLogo || undefined,
            settings: { careerPageEnabled: true },
            teamMembers: [],
            invites: [],
            createdAt: now,
            updatedAt: now,
        });
    } else {
        // Webhook created the org — update it with request-specific data
        await client
            .patch(sanityOrg._id)
            .setIfMissing({ teamMembers: [], invites: [] })
            .set({
                slug,
                description: request.orgDescription || "",
                location: request.orgLocation || undefined,
                website: request.orgWebsite || undefined,
                industry: request.orgIndustry || undefined,
                size: request.orgSize || undefined,
                logo: request.orgLogo || undefined,
                updatedAt: now,
            })
            .commit();
    }

    return sanityOrg;
}

async function ensureDefaultRoles(clerkOrgId, sanityOrgId) {
    const orgAfterPatch = await getOrganizationByClerkOrgId(clerkOrgId);
    if (!orgAfterPatch?.roles || orgAfterPatch.roles.length === 0) {
        await seedDefaultRoles(sanityOrgId);
    }
}

async function addRequestingUserAsAdmin(request, sanityOrg) {
    if (!request.requestedBy?.clerkId) return;

    const now = new Date().toISOString();
    const userDoc = await getUserByClerkId(request.requestedBy.clerkId);
    if (!userDoc) return;

    const isAlreadyMember = sanityOrg.teamMembers?.some(
        (tm) => tm.user?._ref === userDoc._id,
    );

    if (!isAlreadyMember) {
        await client
            .patch(sanityOrg._id)
            .setIfMissing({ teamMembers: [] })
            .append("teamMembers", [
                {
                    _key: `${userDoc._id}-${Date.now()}`,
                    user: { _type: "reference", _ref: userDoc._id },
                    roleKey: ADMIN_ROLE_KEY,
                    joinedAt: now,
                },
            ])
            .commit();
    }
}

async function updateUserClerkRole(clerkId) {
    if (!clerkId) return;
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(clerkId, {
        publicMetadata: { role: "teamMember" },
    });
}

export async function approveRequest(id, adminInfo, orgSlug) {
    // 1. Validate
    const request = await fetchRequestById(id);

    if (!request) {
        throw Object.assign(new Error("Request not found"), { status: 404 });
    }

    if (request.status !== "pending") {
        throw Object.assign(new Error(`Request is already ${request.status}`), {
            status: 400,
        });
    }

    // 2. Create Clerk Organization
    const clerkOrg = await createClerkOrganization(request, id);

    // 3. Ensure Sanity Organization
    const slug = resolveOrgSlug(orgSlug, request.orgName);
    const sanityOrg = await ensureSanityOrganization(clerkOrg.id, request, slug);

    // 4. Seed default roles
    await ensureDefaultRoles(clerkOrg.id, sanityOrg._id);

    // 5. Add requesting user as admin
    await addRequestingUserAsAdmin(request, sanityOrg);

    // 6. Update user's Clerk role
    await updateUserClerkRole(request.requestedBy?.clerkId);

    // 7. Mark request as approved
    const reviewedBy = adminInfo?.email || adminInfo?.name || "admin";
    const updated = await markRequestApproved(id, {
        clerkOrgId: clerkOrg.id,
        sanityOrgId: sanityOrg._id,
        reviewedBy,
    });

    // 8. Send approval notification email — awaited to prevent serverless early termination
    const recipientEmail = request.requestedBy?.email;
    if (recipientEmail) {
        try {
            await sendOrgRequestApprovedEmail({
                recipientEmail,
                requesterName: request.requestedBy?.name || "there",
                organizationName: request.orgName,
            });
        } catch (err) {
            console.error("[OrgApproval] Failed to send approval email:", err.message);
        }
    }

    return updated;
}
