export default {
    name: "application",
    title: "Application",
    type: "document",
    preview: {
        select: {
            applicantName: "applicant.name",
            positionTitle: "jobPosition.title",
            status: "status",
        },
        prepare({ applicantName, positionTitle, status }) {
            const statusEmoji =
                {
                    new: "🆕",
                    screening: "🔍",
                    interview: "🗓️",
                    offered: "🤝",
                    hired: "✅",
                    rejected: "❌",
                }[status] || "📄";
            return {
                title: `${statusEmoji} ${applicantName || "Unknown Applicant"}`,
                subtitle: positionTitle || "Unknown Position",
            };
        },
    },
    fields: [
        {
            name: "jobPosition",
            title: "Job Position",
            type: "reference",
            to: [{ type: "jobPosition" }],
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
            name: "applicant",
            title: "Applicant",
            type: "reference",
            to: [{ type: "user" }],
            validation: (Rule) => Rule.required(),
        },
        {
            name: "form",
            title: "Application Form",
            type: "reference",
            to: [{ type: "form" }],
            description:
                "The form that was filled out (copied from position at time of application)",
        },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "New", value: "new" },
                    { title: "Screening", value: "screening" },
                    { title: "Interview", value: "interview" },
                    { title: "Offered", value: "offered" },
                    { title: "Hired", value: "hired" },
                    { title: "Rejected", value: "rejected" },
                ],
            },
            initialValue: "new",
            validation: (Rule) => Rule.required(),
        },
        {
            name: "notes",
            title: "Recruiter Notes",
            type: "text",
            description: "Internal notes visible only to recruiters",
        },
        {
            name: "rating",
            title: "Rating",
            type: "number",
            description: "Recruiter rating 1-5",
            validation: (Rule) => Rule.min(0).max(5),
        },
        {
            name: "rejectionReason",
            title: "Rejection Reason",
            type: "text",
            description: "Reason for rejection (optionally shared with applicant)",
        },
        {
            name: "answers",
            title: "Form Answers",
            type: "array",
            description: "Answers submitted by the applicant for the application form",
            of: [
                {
                    type: "object",
                    fields: [
                        {
                            name: "fieldId",
                            title: "Field ID",
                            type: "string",
                        },
                        {
                            name: "fieldType",
                            title: "Field Type",
                            type: "string",
                        },
                        {
                            name: "fieldLabel",
                            title: "Field Label",
                            type: "string",
                        },
                        {
                            name: "value",
                            title: "Value",
                            type: "string",
                        },
                        {
                            name: "fileAsset",
                            title: "File Asset",
                            type: "file",
                        },
                    ],
                    preview: {
                        select: {
                            title: "fieldLabel",
                            subtitle: "value",
                        },
                    },
                },
            ],
        },
        {
            name: "profileSnapshot",
            title: "Profile Snapshot",
            type: "object",
            description: "Copy of applicant profile at time of application",
            fields: [
                { name: "headline", title: "Headline", type: "string" },
                { name: "bio", title: "Bio", type: "text" },
                { name: "phone", title: "Phone", type: "string" },
                { name: "location", title: "Location", type: "string" },
                { name: "resumeUrl", title: "Resume URL", type: "url" },
                {
                    name: "skills",
                    title: "Skills",
                    type: "array",
                    of: [{ type: "string" }],
                },
                { name: "linkedinUrl", title: "LinkedIn", type: "url" },
                { name: "portfolioUrl", title: "Portfolio", type: "url" },
                {
                    name: "workExperience",
                    title: "Work Experience",
                    type: "array",
                    of: [
                        {
                            type: "object",
                            fields: [
                                { name: "company", title: "Company", type: "string" },
                                { name: "title", title: "Title", type: "string" },
                                { name: "startDate", title: "Start Date", type: "date" },
                                { name: "endDate", title: "End Date", type: "date" },
                                { name: "isCurrent", title: "Is Current", type: "boolean" },
                                { name: "description", title: "Description", type: "text" },
                            ],
                        },
                    ],
                },
                {
                    name: "education",
                    title: "Education",
                    type: "array",
                    of: [
                        {
                            type: "object",
                            fields: [
                                { name: "institution", title: "Institution", type: "string" },
                                { name: "degree", title: "Degree", type: "string" },
                                { name: "fieldOfStudy", title: "Field of Study", type: "string" },
                                { name: "startDate", title: "Start Date", type: "date" },
                                { name: "endDate", title: "End Date", type: "date" },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: "appliedAt",
            title: "Applied At",
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
