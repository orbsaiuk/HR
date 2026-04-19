export default {
  name: "contract",
  title: "Contract",
  type: "document",
  preview: {
    select: {
      title: "title",
      subtitle: "type",
      partyOne: "formData.firstPartyCompanyName",
      partyTwo: "formData.secondPartyFullName",
      status: "status",
    },
    prepare({ title, subtitle, partyOne, partyTwo, status }) {
      const statusEmoji = status === "sent" ? "📤" : "📝";
      const parties = [partyOne, partyTwo].filter(Boolean).join(" • ");
      return {
        title: `${statusEmoji} ${title || "Untitled Contract"}`,
        subtitle: [subtitle, parties].filter(Boolean).join(" — "),
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
      name: "templateId",
      title: "Template ID",
      type: "string",
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
      name: "type",
      title: "Contract Type",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Created", value: "created" },
          { title: "Sent", value: "sent" },
        ],
      },
      initialValue: "created",
    },
    {
      name: "formData",
      title: "Form Data",
      type: "object",
      fields: [
        { name: "contractType", title: "Contract Type", type: "string" },
        {
          name: "firstPartyCompanyName",
          title: "First Party Company",
          type: "string",
        },
        {
          name: "firstPartyLegalRepresentative",
          title: "First Party Representative",
          type: "string",
        },
        {
          name: "secondPartyFullName",
          title: "Second Party Name",
          type: "string",
        },
        {
          name: "secondPartyNationalId",
          title: "Second Party National ID",
          type: "string",
        },
        {
          name: "secondPartyAddress",
          title: "Second Party Address",
          type: "string",
        },
        {
          name: "secondPartyWhatsapp",
          title: "Second Party WhatsApp",
          type: "string",
        },
        { name: "jobTitle", title: "Job Title", type: "string" },
        {
          name: "compensationAmount",
          title: "Compensation Amount",
          type: "number",
        },
        {
          name: "compensationCurrency",
          title: "Compensation Currency",
          type: "string",
        },
        { name: "startDate", title: "Start Date", type: "string" },
        { name: "endDate", title: "End Date", type: "string" },
        {
          name: "contractDuration",
          title: "Contract Duration",
          type: "string",
        },
        {
          name: "penaltyClauseAmount",
          title: "Penalty Amount",
          type: "number",
        },
        {
          name: "penaltyClauseCurrency",
          title: "Penalty Currency",
          type: "string",
        },
      ],
    },
    {
      name: "clauses",
      title: "Contract Clauses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [{ name: "text", title: "Clause Text", type: "text" }],
        },
      ],
      description: "Resolved contract clauses at the time of creation",
    },
    {
      name: "whatsapp",
      title: "WhatsApp Metadata",
      type: "object",
      fields: [
        { name: "lastSentAt", title: "Last Sent At", type: "datetime" },
        {
          name: "sendCount",
          title: "Send Count",
          type: "number",
          initialValue: 0,
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
