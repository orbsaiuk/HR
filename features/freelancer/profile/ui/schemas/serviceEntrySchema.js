import { z } from "zod";

/**
 * Zod validation schema for a single freelancer service entry.
 */
export const serviceEntrySchema = z
  .object({
    _key: z.string().optional(),
    title: z.string().default(""),
    description: z.string().default(""),
  })
  .superRefine((entry, ctx) => {
    const title = String(entry.title || "").trim();
    const description = String(entry.description || "").trim();

    const hasAnyValue = Boolean(
      title || description,
    );
    if (!hasAnyValue) return;

    if (!title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "عنوان الخدمة مطلوب.",
      });
    }
  });

/**
 * Default values for a new service row.
 */
export const serviceEntryDefaults = {
  _key: undefined,
  title: "",
  description: "",
};
