export default {
    name: "teamMember",
    title: "Team Member",
    type: "document",
    preview: {
        select: {
            title: "name",
            subtitle: "email",
            media: "avatar",
        },
    },
    fields: [
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this belongs to",
        },
        {
            name: "role",
            title: "Role",
            type: "string",
            options: {
                list: [
                    { title: "Admin", value: "admin" },
                    { title: "Recruiter", value: "recruiter" },
                    { title: "Hiring Manager", value: "hiring_manager" },
                    { title: "Viewer", value: "viewer" },
                ],
            },
            initialValue: "recruiter",
        },
        {
            name: "clerkId",
            title: "Clerk ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "email",
            title: "Email",
            type: "string",
            validation: (Rule) => Rule.required().email(),
        },
        {
            name: "bio",
            title: "Bio",
            type: "text",
        },
        {
            name: "avatar",
            title: "Avatar",
            type: "image",
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
