export const orgRequestQueries = {
    getByUser: `*[_type == "organizationRequest" && requestedBy._ref == $userId] | order(createdAt desc) {
        _id,
        orgName,
        orgSlug,
        orgDescription,
        orgWebsite,
        orgIndustry,
        orgSize,
        "orgLogoUrl": orgLogo.asset->url,
        contactEmail,
        contactPhone,
        status,
        rejectionReason,
        reviewedAt,
        reviewedBy,
        clerkOrgId,
        "organizationId": organization._ref,
        createdAt,
        updatedAt
    }`,

    getById: `*[_type == "organizationRequest" && _id == $id][0] {
        ...,
        "requestedBy": requestedBy->{ _id, name, email, clerkId },
        "orgLogoUrl": orgLogo.asset->url,
        "organizationId": organization._ref
    }`,

    getPending: `*[_type == "organizationRequest" && status == "pending"] | order(createdAt asc) {
        _id,
        orgName,
        orgSlug,
        orgIndustry,
        orgSize,
        contactEmail,
        status,
        "requestedBy": requestedBy->{ _id, name, email, clerkId },
        "orgLogoUrl": orgLogo.asset->url,
        createdAt
    }`,

    checkDuplicate: `count(*[_type == "organizationRequest" && requestedBy._ref == $userId && status == "pending"])`,
};
