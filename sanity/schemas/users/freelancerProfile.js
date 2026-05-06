export default {
  name: "freelancerProfile",
  title: "Freelancer Profile",
  type: "document",
  preview: {
    select: {
      title: "user.name",
      subtitle: "user.email",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Freelancer Profile",
        subtitle,
      };
    },
  },
  fieldsets: [
    {
      name: "basic",
      title: "Basic Info",
      options: { collapsible: true },
    },
    {
      name: "skills",
      title: "Skills",
      options: { collapsible: true },
    },
    {
      name: "social",
      title: "Social Links",
      options: { collapsible: true },
    },
    {
      name: "services",
      title: "Services",
      options: { collapsible: true },
    },
    {
      name: "portfolio",
      title: "Portfolio Projects",
      options: { collapsible: true },
    },
  ],
  fields: [
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        disableNew: true,
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
      name: "twitterUrl",
      title: "Twitter URL",
      type: "url",
      fieldset: "social",
    },
    {
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      fieldset: "social",
    },
    {
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      fieldset: "social",
    },
    {
      name: "services",
      title: "Services",
      type: "array",
      fieldset: "services",
      of: [
        {
          type: "object",
          name: "serviceEntry",
          title: "Service",
          preview: {
            select: {
              title: "title",
            },
            prepare({ title }) {
              return {
                title: title || "Untitled Service",
              };
            },
          },
          fields: [
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
              rows: 3,
            },
          ],
        },
      ],
    },
    {
      name: "portfolioProjects",
      title: "Portfolio Projects",
      type: "array",
      fieldset: "portfolio",
      of: [
        {
          type: "object",
          name: "portfolioProject",
          title: "Portfolio Project",
          preview: {
            select: {
              title: "title",
              media: "image",
            },
          },
          fields: [
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "link",
              title: "Project Link",
              type: "url",
            },
          ],
        },
      ],
    },
  ],
};
