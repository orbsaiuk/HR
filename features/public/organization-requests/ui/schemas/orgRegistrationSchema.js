import { z } from "zod";

/**
 * Zod validation schema for organization registration form.
 */
export const orgRegistrationSchema = z.object({
  // Step 1 - All required
  orgName: z.string().min(2, "اسم المؤسسة يجب أن يكون حرفين على الأقل"),
  orgSize: z.string().min(1, "حجم المؤسسة مطلوب"),
  orgIndustry: z.string().min(1, "نوع الصناعة مطلوب"),
  orgLogo: z
    .any()
    .refine((val) => val instanceof File, { message: "شعار المؤسسة مطلوب" }),
  orgDescription: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
  orgFoundedYear: z.coerce.number().min(1900, "سنة غير صحيحة").max(new Date().getFullYear(), "سنة غير صحيحة").optional().or(z.literal("")),

  // Step 2 - Email and Address required, others optional
  contactEmail: z.string().email("البريد الإلكتروني غير صحيح"),
  orgWebsite: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  socialLinks: z
    .object({
      facebook: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
      twitter: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
      linkedin: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
      instagram: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
    })
    .optional(),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),

  // Step 3 - All optional
  registrationNumber: z.string().optional(),
  taxId: z.string().optional(),
});

/**
 * Per-step validation field groups.
 */
export const STEP_FIELDS = [
  ["orgName", "orgSize", "orgIndustry", "orgLogo", "orgDescription", "orgFoundedYear"], // Step 1
  ["contactEmail", "orgWebsite", "contactPhone", "socialLinks", "address"], // Step 2
  ["registrationNumber", "taxId"], // Step 3
  [], // Step 4 (Review) - no validation needed
];

/**
 * Default values matching the schema shape.
 */
export const orgRegistrationDefaults = {
  orgName: "",
  orgSize: "",
  orgIndustry: "",
  orgLogo: null,
  orgDescription: "",
  orgFoundedYear: "",
  contactEmail: "",
  orgWebsite: "",
  contactPhone: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  },
  address: "",
  registrationNumber: "",
  taxId: "",
};

/**
 * Cleans form data by removing empty optional fields before submission.
 */
export function cleanOrgFormData(data) {
  const cleaned = { ...data };

  // Remove empty strings from optional fields
  if (!cleaned.orgWebsite) delete cleaned.orgWebsite;
  if (!cleaned.contactPhone) delete cleaned.contactPhone;
  if (!cleaned.registrationNumber) delete cleaned.registrationNumber;
  if (!cleaned.taxId) delete cleaned.taxId;
  if (!cleaned.orgFoundedYear) {
    delete cleaned.orgFoundedYear;
  } else {
    cleaned.orgFoundedYear = Number(cleaned.orgFoundedYear);
  }

  // Clean up social links - remove empty entries
  if (cleaned.socialLinks) {
    const cleanedSocial = {};
    let hasAnySocial = false;
    Object.entries(cleaned.socialLinks).forEach(([key, value]) => {
      if (value && value.trim()) {
        cleanedSocial[key] = value.trim();
        hasAnySocial = true;
      }
    });
    if (hasAnySocial) {
      cleaned.socialLinks = cleanedSocial;
    } else {
      delete cleaned.socialLinks;
    }
  }

  return cleaned;
}
