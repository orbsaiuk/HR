export default {
  name: "message",
  title: "Message",
  type: "document",
  fields: [
    {
      name: "conversationId",
      title: "Conversation ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "sender",
      title: "Sender",
      type: "reference",
      to: [{ type: "teamMember" }, { type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "recipient",
      title: "Recipient",
      type: "reference",
      to: [{ type: "teamMember" }, { type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "content",
      title: "Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "read",
      title: "Read",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};
