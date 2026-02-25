export default {
    name: "form",
    title: "Form",
    type: "document",
    preview: {
        select: {
            title: "title",
            subtitle: "description",
            status: "status",
        },
        prepare({ title, subtitle, status }) {
            const statusEmoji =
                status === "published" ? "✅" : status === "closed" ? "🔒" : "📝";
            return {
                title: `${statusEmoji} ${title || "Untitled Form"}`,
                subtitle: subtitle || "No description",
            };
        },
    },
    fields: [
        {
            name: "createdBy",
            title: "Created By",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "assignedTo",
            title: "Assigned To",
            type: "array",
            of: [
                {
                    type: "reference",
                    to: [{ type: "user" }],
                },
            ],
            description:
                "Team members assigned to this form. Users with view-only permissions can see forms they are assigned to.",
        },
        {
            name: "organization",
            title: "Organization",
            type: "reference",
            to: [{ type: "organization" }],
            description: "The organization this belongs to",
        },
        {
            name: "title",
            title: "Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Published", value: "published" },
                    { title: "Closed", value: "closed" },
                ],
            },
            initialValue: "draft",
        },
        {
            name: "fields",
            title: "Fields",
            type: "array",
            of: [{ type: "formField" }],
        },
        {
            name: "settings",
            title: "Settings",
            type: "object",
            fields: [
                {
                    name: "allowAnonymous",
                    title: "Allow Anonymous",
                    type: "boolean",
                    initialValue: false,
                },
                {
                    name: "requireAuth",
                    title: "Require Auth",
                    type: "boolean",
                    initialValue: true,
                },
                {
                    name: "limitResponses",
                    title: "Limit Responses",
                    type: "number",
                },
                {
                    name: "expirationDate",
                    title: "Expiration Date",
                    type: "datetime",
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
        {
            name: "publishedAt",
            title: "Published At",
            type: "datetime",
        },
    ],
};

// Form field schema (inline object)
export const formField = {
    name: "formField",
    title: "Form Field",
    type: "object",
    fields: [
        {
            name: "type",
            title: "Type",
            type: "string",
            options: {
                list: [
                    { title: "Text", value: "text" },
                    { title: "Textarea", value: "textarea" },
                    { title: "Number", value: "number" },
                    { title: "Email", value: "email" },
                    { title: "Multiple Choice", value: "multipleChoice" },
                    { title: "Dropdown", value: "dropdown" },
                    { title: "Date", value: "date" },
                    { title: "Time", value: "time" },
                    { title: "Datetime", value: "datetime" },
                    { title: "File", value: "file" },
                ],
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: "label",
            title: "Label",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "placeholder",
            title: "Placeholder",
            type: "string",
        },
        {
            name: "required",
            title: "Required",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "options",
            title: "Options",
            type: "array",
            of: [{ type: "string" }],
        },
        {
            name: "fileType",
            title: "File Type",
            type: "string",
            options: {
                list: [
                    { title: "Any File", value: "any" },
                    { title: "Images Only", value: "image" },
                    { title: "Documents Only", value: "document" },
                ],
            },
            initialValue: "any",
        },
        {
            name: "validation",
            title: "Validation",
            type: "object",
            fields: [
                {
                    name: "min",
                    title: "Min",
                    type: "number",
                },
                {
                    name: "max",
                    title: "Max",
                    type: "number",
                },
                {
                    name: "pattern",
                    title: "Pattern",
                    type: "string",
                },
            ],
        },
        {
            name: "order",
            title: "Order",
            type: "number",
            validation: (Rule) => Rule.required(),
        },
    ],
};
