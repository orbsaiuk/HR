export default {
  name: "contractTemplate",
  title: "Contract Template",
  type: "document",
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      usageCount: "usageCount",
      isActive: "isActive",
    },
    prepare({ title, subtitle, usageCount, isActive }) {
      const statusEmoji = isActive === false ? "⏸️" : "📄";
      const usageLabel = Number.isFinite(usageCount)
        ? `Used ${usageCount} times`
        : "Used 0 times";

      return {
        title: `${statusEmoji} ${title || "Untitled Template"}`,
        subtitle: [subtitle, usageLabel].filter(Boolean).join(" • "),
      };
    },
  },
  fields: [
    {
      name: "organization",
      title: "Organization",
      type: "reference",
      to: [{ type: "organization" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "createdBy",
      title: "Created By",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(2),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "type",
      title: "Template Type",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "clauses",
      title: "Clauses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "text",
              title: "Text",
              type: "text",
              validation: (Rule) => Rule.required().min(3),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "isActive",
      title: "Is Active",
      type: "boolean",
      initialValue: true,
    },
    {
      name: "usageCount",
      title: "Usage Count",
      type: "number",
      initialValue: 0,
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
