export default {
    name: "organizationRequest",
    title: "Organization Request",
    type: "document",
    preview: {
        select: {
            title: "orgName",
            subtitle: "status",
            media: "orgLogo",
        },
    },
    fields: [
        // Requester info
        {
            name: "requestedBy",
            title: "Requested By",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "contactEmail",
            title: "Contact Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        },
        {
            name: "contactPhone",
            title: "Contact Phone",
            type: "string",
        },

        // Organization info
        {
            name: "orgName",
            title: "Organization Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "orgSlug",
            title: "Organization Slug",
            type: "slug",
            options: { source: "orgName" },
        },
        {
            name: "orgDescription",
            title: "Organization Description",
            type: "text",
        },
        {
            name: "orgLocation",
            title: "Organization Location",
            type: "string",
            description: "Headquarters location",
        },
        {
            name: "orgWebsite",
            title: "Organization Website",
            type: "url",
        },
        {
            name: "orgLogo",
            title: "Organization Logo",
            type: "image",
        },
        {
            name: "orgIndustry",
            title: "Industry",
            type: "string",
            options: {
                list: [
                    { title: "Technology", value: "technology" },
                    { title: "Healthcare", value: "healthcare" },
                    { title: "Finance", value: "finance" },
                    { title: "Education", value: "education" },
                    { title: "Retail", value: "retail" },
                    { title: "Manufacturing", value: "manufacturing" },
                    { title: "Consulting", value: "consulting" },
                    { title: "Media & Entertainment", value: "media" },
                    { title: "Non-Profit", value: "nonprofit" },
                    { title: "Government", value: "government" },
                    { title: "Other", value: "other" },
                ],
            },
        },
        {
            name: "orgSize",
            title: "Organization Size",
            type: "string",
            options: {
                list: [
                    { title: "1-10 employees", value: "1-10" },
                    { title: "11-50 employees", value: "11-50" },
                    { title: "51-200 employees", value: "51-200" },
                    { title: "201-500 employees", value: "201-500" },
                    { title: "500+ employees", value: "500+" },
                ],
            },
        },

        // Status & Review
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Pending", value: "pending" },
                    { title: "Approved", value: "approved" },
                    { title: "Rejected", value: "rejected" },
                ],
            },
            initialValue: "pending",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "reviewedAt",
            title: "Reviewed At",
            type: "datetime",
        },
        {
            name: "reviewedBy",
            title: "Reviewed By",
            type: "string",
            description: "Admin name/email who reviewed this request",
        },
        {
            name: "rejectionReason",
            title: "Rejection Reason",
            type: "text",
            description: "Filled when the request is rejected",
        },

        // Result (set after approval)
        {
            name: "clerkOrgId",
            title: "Clerk Organization ID",
            type: "string",
            description: "Clerk Organization ID created on approval",
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "Sanity organization doc created on approval",
        },

        // Timestamps
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
        {
            name: "updatedAt",
            title: "Updated At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
    ],
};
