import { sub } from "date-fns";

export default {
  name: "response",
  title: "Response",
  type: "document",
  preview: {
    select: {
      formTitle: "form.title",
      userName: "user.name",
      userEmail: "user.email",
      submittedAt: "submittedAt",
    },
    prepare({ userName, userEmail, submittedAt }) {
      const date = submittedAt
        ? new Date(submittedAt).toLocaleDateString()
        : "Unknown date";
      return {
        title: `${userName}`,
        subtitle: `${date}`,
      };
    },
  },
  fields: [
    {
      name: "form",
      title: "Form",
      type: "reference",
      to: [{ type: "form" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "user",
      title: "User",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "responseAnswer" }],
    },
    {
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
      initialValue: "pending",
    },
    {
      name: "statusNote",
      title: "Status Note",
      type: "text",
      description: "Optional note about the status (team members only)",
    },
    {
      name: "rejectionReason",
      title: "Rejection Reason",
      type: "text",
      description: "Reason for rejection (sent to student)",
    },
    {
      name: "statusUpdated",
      title: "Status Updated",
      type: "boolean",
      description: "Flag to indicate status was changed",
      initialValue: false,
    },
    {
      name: "statusViewed",
      title: "Status Viewed",
      type: "boolean",
      description: "Flag to indicate user viewed the status update",
      initialValue: false,
    },
    {
      name: "statusViewedAt",
      title: "Status Viewed At",
      type: "datetime",
      description: "When the user viewed the status update",
    },
  ],
};

// Response answer schema (inline object)
export const responseAnswer = {
  name: "responseAnswer",
  title: "Response Answer",
  type: "object",
  preview: {
    select: {
      title: "fieldLabel",
      subtitle: "value",
      fieldType: "fieldType",
    },
    prepare({ title, subtitle, fieldType }) {
      return {
        title: title || "Untitled Field",
        subtitle: subtitle
          ? `${subtitle.substring(0, 100)}${subtitle.length > 100 ? "..." : ""}`
          : "No answer",
        media:
          fieldType === "file"
            ? "📎"
            : fieldType === "multipleChoice"
              ? "☑️"
              : undefined,
      };
    },
  },
  fields: [
    {
      name: "fieldId",
      title: "Field ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "fieldType",
      title: "Field Type",
      type: "string",
    },
    {
      name: "fieldLabel",
      title: "Field Label",
      type: "string",
    },
    {
      name: "value",
      title: "Value",
      type: "string",
    },
    {
      name: "fileAsset",
      title: "File Asset",
      type: "file",
      description: "Uploaded file for file-type fields",
    },
  ],
};
