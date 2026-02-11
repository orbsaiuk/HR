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
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "responseAnswer" }],
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
