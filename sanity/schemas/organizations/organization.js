export default {
    name: "organization",
    title: "Organization",
    type: "document",
    preview: {
        select: {
            title: "name",
            subtitle: "slug.current",
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
            name: "industry",
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
            name: "size",
            title: "Company Size",
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
        {
            name: "location",
            title: "Location",
            type: "string",
            description: "Headquarters location",
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
            name: "roles",
            title: "Roles",
            type: "array",
            description: "Custom roles with permissions for this organization",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "name",
                            title: "Role Name",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "description",
                            title: "Description",
                            type: "string",
                        },
                        {
                            name: "permissions",
                            title: "Permissions",
                            type: "array",
                            of: [{ type: "string" }],
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "isSystem",
                            title: "System Role",
                            type: "boolean",
                            description: "System roles cannot be deleted",
                            initialValue: false,
                        },
                        {
                            name: "createdAt",
                            title: "Created At",
                            type: "datetime",
                            initialValue: () => new Date().toISOString(),
                        },
                    ],
                    preview: {
                        select: {
                            name: "name",
                            isSystem: "isSystem",
                        },
                        prepare({ name, isSystem }) {
                            return {
                                title: name || "Unnamed Role",
                                subtitle: isSystem ? "System Role" : "Custom Role",
                            };
                        },
                    },
                },
            ],
        },
        {
            name: "teamMembers",
            title: "Team Members",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "user",
                            title: "User",
                            type: "reference",
                            to: [{ type: "user" }],
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "roleKey",
                            title: "Role Key",
                            type: "string",
                            description: "References the _key of a role in the organization's roles array",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "joinedAt",
                            title: "Joined At",
                            type: "datetime",
                            initialValue: () => new Date().toISOString(),
                        },
                    ],
                    preview: {
                        select: {
                            userName: "user.name",
                            userEmail: "user.email",
                            roleKey: "roleKey",
                        },
                        prepare({ userName, userEmail, roleKey }) {
                            return {
                                title: userName || userEmail || "Unknown User",
                                subtitle: roleKey ? roleKey.charAt(0).toUpperCase() + roleKey.slice(1).replace("_", " ") : "No role",
                            };
                        },
                    },
                },
            ],
        },
        {
            name: "invites",
            title: "Invites",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "email",
                            title: "Email",
                            type: "string",
                            validation: (Rule) => Rule.required().email(),
                        },
                        {
                            name: "status",
                            title: "Status",
                            type: "string",
                            options: {
                                list: [
                                    { title: "Pending", value: "pending" },
                                    { title: "Joined", value: "joined" },
                                ],
                            },
                            initialValue: "pending",
                        },
                        {
                            name: "roleKey",
                            title: "Role Key",
                            type: "string",
                            description: "The role to assign when the invite is accepted",
                        },
                        {
                            name: "invitedBy",
                            title: "Invited By",
                            type: "reference",
                            to: [{ type: "user" }],
                        },
                        {
                            name: "joinedUser",
                            title: "Joined User",
                            type: "reference",
                            to: [{ type: "user" }],
                            description: "Set when the invite is accepted and the user joins",
                        },
                        {
                            name: "createdAt",
                            title: "Created At",
                            type: "datetime",
                            initialValue: () => new Date().toISOString(),
                        },
                    ],
                    preview: {
                        select: {
                            email: "email",
                            status: "status",
                        },
                        prepare({ email, status }) {
                            const statusEmoji = status === "joined" ? " joined" : "pending";
                            return {
                                title: email || "No email",
                                subtitle: statusEmoji,
                            };
                        },
                    },
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
