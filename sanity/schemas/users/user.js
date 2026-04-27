export default {
  name: "user",
  title: "User",
  type: "document",
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
  fieldsets: [
    {
      name: "basic",
      title: "Basic Profile",
      options: { collapsible: true },
    },
    {
      name: "resume",
      title: "Resume",
      options: { collapsible: true },
    },
    {
      name: "experience",
      title: "Work Experience",
      options: { collapsible: true },
    },
    {
      name: "education",
      title: "Education",
      options: { collapsible: true },
    },
    {
      name: "skills",
      title: "Skills & Languages",
      options: { collapsible: true },
    },
    {
      name: "social",
      title: "Social Links",
      options: { collapsible: true },
    },
  ],
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
      title: "Avatar URL",
      type: "url",
      description: "URL to the user's avatar image (e.g., from Clerk/Google)",
    },
    {
      name: "accountType",
      title: "Account Type",
      type: "string",
      description: "User account type selected during sign-up (permanent)",
      options: {
        list: [
          { title: "Job Seeker", value: "jobSeeker" },
          { title: "Freelancer", value: "freelancer" },
          { title: "Organization Member", value: "orgMember" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "phone",
      title: "Phone",
      type: "string",
      fieldset: "basic",
    },
    {
      name: "headline",
      title: "Headline",
      type: "string",
      fieldset: "basic",
      description: 'e.g. "Frontend Developer | React Specialist"',
    },
    {
      name: "bio",
      title: "Bio",
      type: "text",
      fieldset: "basic",
      rows: 4,
    },
    {
      name: "location",
      title: "Location",
      type: "string",
      fieldset: "basic",
      description: "City, Country",
    },
    {
      name: "dateOfBirth",
      title: "Date of Birth",
      type: "date",
      fieldset: "basic",
    },
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
      description: "Optional external link to your resume",
    },
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
            },
          ],
        },
      ],
    },
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
    {
      name: "languages",
      title: "Languages",
      type: "array",
      fieldset: "skills",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    },
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
    {
      name: "profileComplete",
      title: "Profile Complete",
      type: "boolean",
      initialValue: false,
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
