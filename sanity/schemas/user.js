export default {
    name: "user",
    title: "User",
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
