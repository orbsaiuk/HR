export default {
  name: "conversation",
  title: "Conversation",
  type: "document",
  fields: [
    {
      name: "teamMember",
      title: "Team Member",
      type: "reference",
      to: [{ type: "teamMember" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "relatedForm",
      title: "Related Form",
      type: "reference",
      to: [{ type: "form" }],
    },
    {
      name: "lastMessageAt",
      title: "Last Message At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};
