export default {
    name: "conversation",
    title: "Conversation",
    type: "document",
    preview: {
        select: {
            teamMemberName: "teamMember.name",
            userName: "user.name",
            lastMessageAt: "lastMessageAt",
        },
        prepare({ teamMemberName, userName, lastMessageAt }) {
            return {
                title: `${teamMemberName || "Team Member"} ↔ ${userName || "User"}`,
                subtitle: lastMessageAt
                    ? `Last message: ${new Date(lastMessageAt).toLocaleDateString()}`
                    : "No messages yet",
            };
        },
    },
    fields: [
        {
            name: "teamMember",
            title: "Team Member",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "user",
            title: "User",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this belongs to",
        },
        {
            name: "relatedForm",
            title: "Related Form",
            type: "reference",
            to: [{ type: "form" }],
        },
        {
            name: "lastMessageAt",
            title: "Last Message At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            initialValue: () => new Date().toISOString(),
        },
    ],
};
