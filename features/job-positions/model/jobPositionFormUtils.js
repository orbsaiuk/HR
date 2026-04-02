import { z } from "zod";

const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "remote",
];

const APPLICATION_METHODS = ["form", "profile", "both"];

const parseOptionalNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const normalizeText = (value) =>
  typeof value === "string" ? value : value == null ? "" : String(value);

const isPastDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDay = new Date(date);
  deadlineDay.setHours(0, 0, 0, 0);

  return deadlineDay < today;
};

const baseFormShape = {
  title: z.string().trim().min(1, "المسمى الوظيفي مطلوب"),
  description: z.string().transform(normalizeText),
  requirements: z.string().transform(normalizeText),
  location: z.string().transform(normalizeText),
  type: z.enum(EMPLOYMENT_TYPES),
  salaryMin: z.string().transform(normalizeText),
  salaryMax: z.string().transform(normalizeText),
  currency: z.string().trim().min(1, "العملة مطلوبة"),
  status: z.string().transform(normalizeText),
  deadline: z.string().transform(normalizeText),
  isUrgent: z.boolean(),
  formId: z.string().transform(normalizeText),
  applicationMethod: z.enum(APPLICATION_METHODS),
  assignedTo: z.array(z.string()).default([]),
};

const withCompensationValidation = (schema) =>
  schema.superRefine((values, ctx) => {
    const salaryMin = parseOptionalNumber(values.salaryMin);
    const salaryMax = parseOptionalNumber(values.salaryMax);

    if (Number.isNaN(salaryMin)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الحد الادنى للراتب غير صالح",
        path: ["salaryMin"],
      });
    }

    if (Number.isNaN(salaryMax)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الحد الاقصى للراتب غير صالح",
        path: ["salaryMax"],
      });
    }

    if (salaryMin !== null && !Number.isNaN(salaryMin) && salaryMin < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الحد الادنى للراتب يجب ان يكون اكبر من او يساوي صفر",
        path: ["salaryMin"],
      });
    }

    if (salaryMax !== null && !Number.isNaN(salaryMax) && salaryMax < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الحد الاقصى للراتب يجب ان يكون اكبر من او يساوي صفر",
        path: ["salaryMax"],
      });
    }

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      !Number.isNaN(salaryMin) &&
      !Number.isNaN(salaryMax) &&
      salaryMin > salaryMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "الحد الادنى للراتب يجب ان يكون اقل من الحد الاقصى",
        path: ["salaryMax"],
      });
    }
  });

export const jobPositionCreateSchema = withCompensationValidation(
  z
    .object({
      ...baseFormShape,
      department: z.string().trim().min(1, "القسم مطلوب"),
    })
    .superRefine((values, ctx) => {
      if (!values.deadline) return;

      const date = new Date(values.deadline);
      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "تاريخ الموعد النهائي غير صالح",
          path: ["deadline"],
        });
        return;
      }

      if (isPastDate(values.deadline)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "لا يمكن اختيار موعد نهائي بتاريخ سابق",
          path: ["deadline"],
        });
      }
    }),
);

export const jobPositionEditSchema = withCompensationValidation(
  z.object({
    ...baseFormShape,
    department: z.string().transform(normalizeText),
  }),
);

export const jobPositionCreateDefaults = {
  title: "",
  department: "",
  description: "",
  requirements: "",
  location: "",
  type: "full-time",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  status: "draft",
  deadline: "",
  isUrgent: false,
  formId: "",
  applicationMethod: "form",
  assignedTo: [],
};

export const jobPositionEditDefaults = {
  ...jobPositionCreateDefaults,
  assignedTo: [],
};

const toNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function buildJobPositionPayload(values, linkedFormId) {
  const payload = {
    ...values,
    formId: linkedFormId,
    salaryMin: toNullableNumber(values.salaryMin),
    salaryMax: toNullableNumber(values.salaryMax),
    isUrgent: Boolean(values.isUrgent),
  };

  return payload;
}

export function mapPositionToEditValues(position) {
  if (!position) {
    return { ...jobPositionEditDefaults };
  }

  return {
    ...jobPositionEditDefaults,
    title: position.title || "",
    department: position.department || "",
    description: position.description || "",
    requirements: position.requirements || "",
    location: position.location || "",
    type: position.type || "full-time",
    salaryMin:
      position.salaryMin === null || position.salaryMin === undefined
        ? ""
        : String(position.salaryMin),
    salaryMax:
      position.salaryMax === null || position.salaryMax === undefined
        ? ""
        : String(position.salaryMax),
    currency: position.currency || "USD",
    status: position.status || "draft",
    deadline: position.deadline ? position.deadline.slice(0, 16) : "",
    isUrgent: Boolean(position.isUrgent),
    formId: position.form?._id || "",
    applicationMethod: position.applicationMethod || "form",
    assignedTo: position.assignedTo?.map((user) => user._id) || [],
  };
}

export function getFirstFormErrorMessage(errors, fallbackMessage) {
  const fallback = fallbackMessage || "تحقق من الحقول المطلوبة";
  if (!errors || typeof errors !== "object") return fallback;

  const queue = Object.values(errors);
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (typeof current.message === "string" && current.message.trim()) {
      return current.message;
    }

    if (typeof current === "object") {
      queue.push(...Object.values(current));
    }
  }

  return fallback;
}

export function getFormCompleteness(formData) {
  const fields = [
    "title",
    "department",
    "description",
    "requirements",
    "location",
    "type",
    "salaryMin",
    "salaryMax",
    "deadline",
  ];

  const filled = fields.filter((field) => {
    const value = formData[field];
    if (typeof value === "string") return value.trim().length > 0;
    return value !== null && value !== undefined && value !== "";
  }).length;

  return Math.round((filled / fields.length) * 100);
}
