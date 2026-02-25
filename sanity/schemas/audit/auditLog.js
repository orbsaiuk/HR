export default {
    name: "auditLog",
    title: "Audit Log",
    type: "document",
    fields: [
        {
            name: "action",
            title: "Action",
            type: "string",
            description:
                'The action that was performed, e.g. "role.created", "member.removed"',
            validation: (Rule) => Rule.required(),
        },
        {
            name: "category",
            title: "Category",
            type: "string",
            description:
                'The category of the action, e.g. "roles", "team", "forms", "positions"',
            options: {
                list: [
                    { title: "Roles", value: "roles" },
                    { title: "Team", value: "team" },
                    { title: "Forms", value: "forms" },
                    { title: "Positions", value: "positions" },
                    { title: "Applications", value: "applications" },
                    { title: "Settings", value: "settings" },
                ],
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "string",
            description: 'Human-readable description, e.g. "Created role \'Recruiter\'"',
            validation: (Rule) => Rule.required(),
        },
        {
            name: "actor",
            title: "Actor",
            type: "reference",
            to: [{ type: "user" }],
            description: "The user who performed the action",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this action belongs to",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "targetType",
            title: "Target Type",
            type: "string",
            description:
                'The type of resource affected, e.g. "role", "teamMember", "form", "position"',
        },
        {
            name: "targetId",
            title: "Target ID",
            type: "string",
            description: "The ID of the affected resource",
        },
        {
            name: "metadata",
            title: "Metadata",
            type: "object",
            description: "Additional context about the action",
            fields: [
                {
                    name: "before",
                    title: "Before",
                    type: "text",
                    description: "JSON snapshot of the resource before the change",
                },
                {
                    name: "after",
                    title: "After",
                    type: "text",
                    description: "JSON snapshot of the resource after the change",
                },
                {
                    name: "ip",
                    title: "IP Address",
                    type: "string",
                    description: "IP address of the actor",
                },
            ],
        },
        {
            name: "createdAt",
            title: "Created At",
            type: "datetime",
            description: "When the action was performed",
            validation: (Rule) => Rule.required(),
        },
    ],
    orderings: [
        {
            title: "Most Recent",
            name: "createdAtDesc",
            by: [{ field: "createdAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "action",
            subtitle: "description",
            date: "createdAt",
        },
        prepare({ title, subtitle, date }) {
            return {
                title: title || "Unknown Action",
                subtitle: `${subtitle || ""} — ${date ? new Date(date).toLocaleString() : ""}`,
            };
        },
    },
};
