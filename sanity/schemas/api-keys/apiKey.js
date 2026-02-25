export default {
    name: "apiKey",
    title: "API Key",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            description: "Human-readable name for this API key (e.g., 'CI/CD Pipeline', 'Analytics Integration')",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "keyHash",
            title: "Key Hash",
            type: "string",
            description: "SHA-256 hash of the API key. The raw key is never stored.",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "keyPrefix",
            title: "Key Prefix",
            type: "string",
            description: "First 8 characters of the key for identification (e.g., 'fba_1234')",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this API key belongs to",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "createdBy",
            title: "Created By",
            type: "reference",
            to: [{ type: "user" }],
            description: "The admin who created this API key",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "permissions",
            title: "Permissions",
            type: "array",
            of: [{ type: "string" }],
            description: "The permissions granted to this API key. Cannot exceed the creating user's permissions.",
            validation: (Rule) => Rule.required().min(1),
        },
        {
            name: "expiresAt",
            title: "Expires At",
            type: "datetime",
            description: "When this API key expires. Leave empty for no expiration.",
        },
        {
            name: "lastUsedAt",
            title: "Last Used At",
            type: "datetime",
            description: "When this API key was last used to make a request",
        },
        {
            name: "isRevoked",
            title: "Revoked",
            type: "boolean",
            description: "Whether this API key has been revoked",
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
            title: "name",
            prefix: "keyPrefix",
            revoked: "isRevoked",
        },
        prepare({ title, prefix, revoked }) {
            return {
                title: title || "Unnamed API Key",
                subtitle: `${prefix}... ${revoked ? "🔴 Revoked" : "🟢 Active"}`,
            };
        },
    },
};
