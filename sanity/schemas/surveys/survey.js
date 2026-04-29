export default {
  name: "survey",
  title: "Survey",
  type: "document",
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Survey",
        subtitle: subtitle || "No description",
      };
    },
  },
  fields: [
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "surveyQuestion" }],
    },
    {
      name: "settings",
      title: "Settings",
      type: "object",
      fields: [
        {
          name: "allowAnonymous",
          title: "Allow Anonymous",
          type: "boolean",
          initialValue: false,
        },
        {
          name: "requireAuth",
          title: "Require Authentication",
          type: "boolean",
          initialValue: true,
        },
        {
          name: "limitResponses",
          title: "Limit Responses",
          type: "number",
        },
        {
          name: "expiresAt",
          title: "Expires At",
          type: "datetime",
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

export const surveyResponse = {
  name: "surveyResponse",
  title: "Survey Response",
  type: "document",
  preview: {
    select: {
      title: "survey.title",
      subtitle: "respondentEmail",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Survey response",
        subtitle: subtitle || "Anonymous respondent",
      };
    },
  },
  fields: [
    {
      name: "survey",
      title: "Survey",
      type: "reference",
      to: [{ type: "survey" }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: "respondent",
      title: "Respondent",
      type: "reference",
      to: [{ type: "user" }],
    },
    {
      name: "respondentName",
      title: "Respondent Name",
      type: "string",
    },
    {
      name: "respondentEmail",
      title: "Respondent Email",
      type: "string",
    },
    {
      name: "answers",
      title: "Answers",
      type: "array",
      of: [{ type: "surveyAnswer" }],
    },
    {
      name: "metadata",
      title: "Metadata",
      type: "object",
      fields: [
        { name: "userAgent", title: "User Agent", type: "string" },
      ],
    },
    {
      name: "submittedAt",
      title: "Submitted At",
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

export const surveyAnswer = {
  name: "surveyAnswer",
  title: "Survey Answer",
  type: "object",
  fields: [
    {
      name: "questionKey",
      title: "Question Key",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "questionLabel",
      title: "Question Label",
      type: "string",
    },
    {
      name: "questionType",
      title: "Question Type",
      type: "string",
    },
    {
      name: "value",
      title: "Value",
      type: "text",
    },
    {
      name: "values",
      title: "Values",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "file",
      title: "File",
      type: "file",
    },
  ],
};

export const surveyQuestion = {
  name: "surveyQuestion",
  title: "Survey Question",
  type: "object",
  fields: [
    {
      name: "type",
      title: "Type",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Textarea", value: "textarea" },
          { title: "Number", value: "number" },
          { title: "Email", value: "email" },
          { title: "Multiple Choice", value: "multipleChoice" },
          { title: "Dropdown", value: "dropdown" },
          { title: "Date", value: "date" },
          { title: "Time", value: "time" },
          { title: "Datetime", value: "datetime" },
          { title: "File", value: "file" },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "placeholder",
      title: "Placeholder",
      type: "string",
    },
    {
      name: "required",
      title: "Required",
      type: "boolean",
      initialValue: false,
    },
    {
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "fileType",
      title: "File Type",
      type: "string",
      options: {
        list: [
          { title: "Any File", value: "any" },
          { title: "Images Only", value: "image" },
          { title: "Documents Only", value: "document" },
        ],
      },
      initialValue: "any",
    },
    {
      name: "validation",
      title: "Validation",
      type: "object",
      fields: [
        { name: "min", title: "Min", type: "number" },
        { name: "max", title: "Max", type: "number" },
        { name: "pattern", title: "Pattern", type: "string" },
      ],
    },
    {
      name: "order",
      title: "Order",
      type: "number",
      validation: (Rule) => Rule.required(),
    },
  ],
};
