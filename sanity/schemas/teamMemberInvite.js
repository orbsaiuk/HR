export default {
  name: "teamMemberInvite",
  title: "Team Member Invite",
  type: "document",
  preview: {
    select: {
      title: "email",
      subtitle: "status",
    },
  },
  fields: [
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Joined", value: "joined" },
        ],
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "invitedBy",
      title: "Invited By",
      type: "reference",
      to: [{ type: "teamMember" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "teamMember",
      title: "Team Member",
      type: "reference",
      to: [{ type: "teamMember" }],
      description:
        "Set when the invited user signs up and joins as a team member",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
  ],
};
