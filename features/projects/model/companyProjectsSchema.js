import { z } from "zod";

export const PROJECT_CATEGORY_OPTIONS = [
  { value: "برمجة", label: "برمجة" },
  { value: "تصميم", label: "تصميم" },
  { value: "تسويق", label: "تسويق" },
  { value: "إدارة", label: "إدارة" },
];

export const PROJECT_STATUS_OPTIONS = [
  { value: "قيد التنفيذ", label: "قيد التنفيذ" },
  { value: "قيد المراجعة", label: "قيد المراجعة" },
  { value: "مكتمل", label: "مكتمل" },
];

const categoryValues = PROJECT_CATEGORY_OPTIONS.map((option) => option.value);
const statusValues = PROJECT_STATUS_OPTIONS.map((option) => option.value);

export const companyProjectFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "عنوان المشروع يجب أن يكون 5 أحرف على الأقل")
      .max(120, "عنوان المشروع طويل جداً"),
    location: z
      .string()
      .trim()
      .min(2, "الموقع مطلوب")
      .max(80, "الموقع طويل جداً"),
    category: z.enum(categoryValues, {
      message: "يرجى اختيار تصنيف المشروع",
    }),
    status: z.enum(statusValues, {
      message: "يرجى اختيار حالة المشروع",
    }),
    description: z
      .string()
      .trim()
      .min(20, "وصف المشروع يجب أن يكون 20 حرفاً على الأقل")
      .max(800, "وصف المشروع طويل جداً"),
    duration: z
      .string()
      .trim()
      .min(2, "المدة المتوقعة مطلوبة")
      .max(40, "صيغة المدة طويلة جداً"),
    budgetMin: z.coerce
      .number({
        invalid_type_error: "الحد الأدنى للميزانية غير صحيح",
      })
      .int("الحد الأدنى يجب أن يكون رقماً صحيحاً")
      .min(100, "الحد الأدنى للميزانية يجب أن يكون 100 دولار على الأقل"),
    budgetMax: z.coerce
      .number({
        invalid_type_error: "الحد الأعلى للميزانية غير صحيح",
      })
      .int("الحد الأعلى يجب أن يكون رقماً صحيحاً")
      .min(100, "الحد الأعلى للميزانية يجب أن يكون 100 دولار على الأقل"),
  })
  .refine((data) => data.budgetMax >= data.budgetMin, {
    message: "الحد الأعلى يجب أن يكون أكبر من أو يساوي الحد الأدنى",
    path: ["budgetMax"],
  });

export const companyProjectFormDefaults = {
  title: "",
  location: "",
  category: "",
  status: "",
  description: "",
  duration: "",
  budgetMin: "",
  budgetMax: "",
};

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatBudgetRange(min, max) {
  return `${formatUsd(min)} - ${formatUsd(max)}`;
}

export function mapCompanyProjectFormToCard(data) {
  return {
    title: data.title.trim(),
    location: data.location.trim(),
    category: data.category,
    status: data.status,
    description: data.description.trim(),
    duration: data.duration.trim(),
    budgetMin: data.budgetMin,
    budgetMax: data.budgetMax,
    budgetRange: formatBudgetRange(data.budgetMin, data.budgetMax),
  };
}

function parseBudgetRange(budgetRange) {
  const values = String(budgetRange || "")
    .replace(/,/g, "")
    .match(/\d+/g)
    ?.map(Number);

  if (values?.length >= 2) {
    return { budgetMin: values[0], budgetMax: values[1] };
  }

  if (values?.length === 1) {
    return { budgetMin: values[0], budgetMax: values[0] };
  }

  return {
    budgetMin: companyProjectFormDefaults.budgetMin,
    budgetMax: companyProjectFormDefaults.budgetMax,
  };
}

export function mapCompanyProjectCardToForm(project = {}) {
  const budgetValues =
    typeof project.budgetMin === "number" &&
    typeof project.budgetMax === "number"
      ? { budgetMin: project.budgetMin, budgetMax: project.budgetMax }
      : parseBudgetRange(project.budgetRange);

  return {
    title: project.title || "",
    location: project.location || "",
    category: project.category || companyProjectFormDefaults.category,
    status: project.status || companyProjectFormDefaults.status,
    description: project.description || "",
    duration: project.duration || "",
    budgetMin: budgetValues.budgetMin,
    budgetMax: budgetValues.budgetMax,
  };
}
