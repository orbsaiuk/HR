export default {
  name: "message",
  title: "Message",
  type: "document",
  preview: {
    select: {
      senderName: "sender.name",
      recipientName: "recipient.name",
      content: "content",
      createdAt: "createdAt",
    },
    prepare({ senderName, recipientName, content, createdAt }) {
      const truncatedContent = content ? content.substring(0, 50) + (content.length > 50 ? "..." : "") : "No content";
      return {
        title: `${senderName || "Unknown"} → ${recipientName || "Unknown"}`,
        subtitle: `${truncatedContent} • ${createdAt ? new Date(createdAt).toLocaleDateString() : ""}`,
      };
    },
  },
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
      to: [{ type: "user" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "recipient",
      title: "Recipient",
      type: "reference",
      to: [{ type: "user" }],
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
