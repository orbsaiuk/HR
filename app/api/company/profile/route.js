import { NextResponse } from "next/server";
import {
  resolveOrgContext,
  invalidateOrgContextCache,
} from "@/shared/lib/orgContext";
import {
  getOrganizationById,
  updateOrganization,
} from "@/features/shared/organizations/services/organizationService";
import { logAuditEvent } from "@/features/company/audit/services/auditService";

/**
 * GET /api/company/profile — Get the current organization's full profile
 */
export async function GET() {
  try {
    const context = await resolveOrgContext();
    const organization = await getOrganizationById(context.orgId);

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("GET /api/company/profile error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch company profile" },
      { status },
    );
  }
}

/**
 * PUT /api/company/profile — Update the current organization's profile
 */
export async function PUT(request) {
  try {
    const context = await resolveOrgContext();
    const input = await request.json();

    if (input.logoBase64) {
      const base64Data = input.logoBase64.replace(
        /^data:image\/\w+;base64,/,
        "",
      );
      const { client } = require("@/sanity/client");
      const buffer = Buffer.from(base64Data, "base64");
      const asset = await client.assets.upload("image", buffer);

      input.logo = {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
      delete input.logoBase64;
    }

    // Handle service image uploads
    if (input.services && Array.isArray(input.services)) {
      const { client } = require("@/sanity/client");
      for (let i = 0; i < input.services.length; i++) {
        const service = input.services[i];
        if (service.imageBase64) {
          const base64Data = service.imageBase64.replace(
            /^data:image\/\w+;base64,/,
            "",
          );
          const buffer = Buffer.from(base64Data, "base64");
          const asset = await client.assets.upload("image", buffer);
          service.image = {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          };
          delete service.imageBase64;
        }
      }
    }

    await updateOrganization(context.orgId, input);

    // Re-fetch the full profile with all joined/computed fields (e.g. openPositions)
    // because Sanity's patch().commit() only returns raw document fields
    const organization = await getOrganizationById(context.orgId);

    // Invalidate cached org context so changes take effect immediately
    invalidateOrgContextCache(context.organization.clerkOrgId);

    await logAuditEvent({
      action: "company_profile.updated",
      category: "profile",
      description: "Updated company profile",
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "organization",
      targetId: context.orgId,
      metadata: {
        updatedFields: Object.keys(input),
      },
    });

    return NextResponse.json(organization);
  } catch (error) {
    console.error("PUT /api/company/profile error:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update company profile" },
      { status },
    );
  }
}
