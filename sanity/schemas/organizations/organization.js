export default {
    name: "organization",
    title: "Organization",
    type: "document",
    preview: {
        select: {
            title: "name",
            subtitle: "slug",
            media: "logo",
        },
    },
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
            validation: (Rule) => Rule.required(),
        },
        {
            name: "clerkOrgId",
            title: "Clerk Organization ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "website",
            title: "Website",
            type: "url",
        },
        {
            name: "settings",
            title: "Settings",
            type: "object",
            fields: [
                {
                    name: "brandColor",
                    title: "Brand Color",
                    type: "string",
                },
                {
                    name: "careerPageEnabled",
                    title: "Career Page Enabled",
                    type: "boolean",
                    initialValue: true,
                },
            ],
        },
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
