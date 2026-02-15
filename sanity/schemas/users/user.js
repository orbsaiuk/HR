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
    fieldsets: [
        { name: "profile", title: "Profile Information", options: { collapsible: true } },
        { name: "resume", title: "Resume / CV", options: { collapsible: true } },
        { name: "experience", title: "Work Experience", options: { collapsible: true } },
        { name: "education", title: "Education", options: { collapsible: true } },
        { name: "skills", title: "Skills & Languages", options: { collapsible: true } },
        { name: "social", title: "Social / Links", options: { collapsible: true } },
    ],
    fields: [
        // ── Existing fields (unchanged) ──────────────────────────────
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

        // ── NEW: Profile fields ──────────────────────────────────────
        {
            name: "phone",
            title: "Phone",
            type: "string",
            fieldset: "profile",
        },
        {
            name: "headline",
            title: "Headline",
            type: "string",
            fieldset: "profile",
            description: 'e.g. "Senior Software Engineer"',
        },
        {
            name: "bio",
            title: "Bio",
            type: "text",
            fieldset: "profile",
            description: "Short summary / about me",
        },
        {
            name: "location",
            title: "Location",
            type: "string",
            fieldset: "profile",
            description: "City, Country",
        },
        {
            name: "dateOfBirth",
            title: "Date of Birth",
            type: "date",
            fieldset: "profile",
        },

        // ── NEW: Resume / CV ─────────────────────────────────────────
        {
            name: "resume",
            title: "Resume",
            type: "file",
            fieldset: "resume",
            options: {
                accept: ".pdf,.doc,.docx",
            },
            description: "Upload PDF or DOC file",
        },
        {
            name: "resumeUrl",
            title: "Resume URL",
            type: "url",
            fieldset: "resume",
            description: "Or provide an external link to your resume",
        },

        // ── NEW: Work Experience ─────────────────────────────────────
        {
            name: "workExperience",
            title: "Work Experience",
            type: "array",
            fieldset: "experience",
            of: [
                {
                    type: "object",
                    name: "workEntry",
                    title: "Work Entry",
                    preview: {
                        select: {
                            title: "title",
                            subtitle: "company",
                        },
                    },
                    fields: [
                        {
                            name: "company",
                            title: "Company",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "title",
                            title: "Job Title",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "startDate",
                            title: "Start Date",
                            type: "date",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "endDate",
                            title: "End Date",
                            type: "date",
                            description: "Leave empty if this is your current role",
                        },
                        {
                            name: "isCurrent",
                            title: "Currently Working Here",
                            type: "boolean",
                            initialValue: false,
                        },
                        {
                            name: "description",
                            title: "Description",
                            type: "text",
                        },
                    ],
                },
            ],
        },

        // ── NEW: Education ───────────────────────────────────────────
        {
            name: "education",
            title: "Education",
            type: "array",
            fieldset: "education",
            of: [
                {
                    type: "object",
                    name: "educationEntry",
                    title: "Education Entry",
                    preview: {
                        select: {
                            title: "degree",
                            subtitle: "institution",
                        },
                    },
                    fields: [
                        {
                            name: "institution",
                            title: "Institution",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "degree",
                            title: "Degree",
                            type: "string",
                            description: 'e.g. "Bachelor of Science"',
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "fieldOfStudy",
                            title: "Field of Study",
                            type: "string",
                        },
                        {
                            name: "startDate",
                            title: "Start Date",
                            type: "date",
                        },
                        {
                            name: "endDate",
                            title: "End Date",
                            type: "date",
                        },
                        {
                            name: "grade",
                            title: "Grade",
                            type: "string",
                            description: "Optional GPA or grade",
                        },
                    ],
                },
            ],
        },

        // ── NEW: Skills ──────────────────────────────────────────────
        {
            name: "skills",
            title: "Skills",
            type: "array",
            fieldset: "skills",
            of: [{ type: "string" }],
            options: {
                layout: "tags",
            },
        },

        // ── NEW: Languages ───────────────────────────────────────────
        {
            name: "languages",
            title: "Languages",
            type: "array",
            fieldset: "skills",
            of: [
                {
                    type: "object",
                    name: "languageEntry",
                    title: "Language",
                    preview: {
                        select: {
                            title: "language",
                            subtitle: "proficiency",
                        },
                    },
                    fields: [
                        {
                            name: "language",
                            title: "Language",
                            type: "string",
                            validation: (Rule) => Rule.required(),
                        },
                        {
                            name: "proficiency",
                            title: "Proficiency",
                            type: "string",
                            options: {
                                list: [
                                    { title: "Native", value: "native" },
                                    { title: "Fluent", value: "fluent" },
                                    { title: "Intermediate", value: "intermediate" },
                                    { title: "Basic", value: "basic" },
                                ],
                            },
                            validation: (Rule) => Rule.required(),
                        },
                    ],
                },
            ],
        },

        // ── NEW: Social / Links ──────────────────────────────────────
        {
            name: "linkedinUrl",
            title: "LinkedIn URL",
            type: "url",
            fieldset: "social",
        },
        {
            name: "githubUrl",
            title: "GitHub URL",
            type: "url",
            fieldset: "social",
        },
        {
            name: "portfolioUrl",
            title: "Portfolio URL",
            type: "url",
            fieldset: "social",
        },

        // ── NEW: Profile completeness ────────────────────────────────
        {
            name: "profileComplete",
            title: "Profile Complete",
            type: "boolean",
            description: "Set when all required profile fields are filled",
            initialValue: false,
        },
    ],
};
