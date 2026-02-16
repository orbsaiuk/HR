export default {
    name: "jobPosition",
    title: "Job Position",
    type: "document",
    preview: {
        select: {
            title: "title",
            subtitle: "department",
            status: "status",
        },
        prepare({ title, subtitle, status }) {
            const statusEmoji =
                status === "open"
                    ? "🟢"
                    : status === "on-hold"
                        ? "🟡"
                        : status === "closed"
                            ? "🔴"
                            : "📝";
            return {
                title: `${statusEmoji} ${title || "Untitled Position"}`,
                subtitle: subtitle || "No department",
            };
        },
    },
    fields: [
        {
            name: "recruiter",
            title: "Recruiter",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
            description: "The recruiter who created this position",
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
            title: "Job Title",
            type: "string",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "department",
            title: "Department",
            type: "string",
        },
        {
            name: "description",
            title: "Description",
            type: "text",
        },
        {
            name: "requirements",
            title: "Requirements",
            type: "text",
            description: "Key requirements and qualifications",
        },
        {
            name: "location",
            title: "Location",
            type: "string",
        },
        {
            name: "type",
            title: "Employment Type",
            type: "string",
            options: {
                list: [
                    { title: "Full-time", value: "full-time" },
                    { title: "Part-time", value: "part-time" },
                    { title: "Contract", value: "contract" },
                    { title: "Internship", value: "internship" },
                    { title: "Remote", value: "remote" },
                ],
            },
            initialValue: "full-time",
        },
        {
            name: "salaryMin",
            title: "Salary Min",
            type: "number",
        },
        {
            name: "salaryMax",
            title: "Salary Max",
            type: "number",
        },
        {
            name: "currency",
            title: "Currency",
            type: "string",
            initialValue: "USD",
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Draft", value: "draft" },
                    { title: "Open", value: "open" },
                    { title: "On Hold", value: "on-hold" },
                    { title: "Closed", value: "closed" },
                ],
            },
            initialValue: "draft",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "deadline",
            title: "Application Deadline",
            type: "datetime",
        },
        {
            name: "applicationMethod",
            title: "Application Method",
            type: "string",
            options: {
                list: [
                    { title: "Apply with Profile", value: "profile" },
                    { title: "Apply with Form", value: "form" },
                    { title: "Both - Profile + Form", value: "both" },
                ],
            },
            initialValue: "form",
            description: "How applicants should apply to this position",
        },
        {
            name: "form",
            title: "Application Form",
            type: "reference",
            to: [{ type: "form" }],
            description: "The application form linked to this position",
            hidden: ({ parent }) => parent?.applicationMethod === "profile",
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
