import { z } from "zod";
import { optionalHttpUrlSchema } from "./optionalHttpUrlSchema";

/**
 * Zod validation schema for a single portfolio project entry.
 */
export const portfolioProjectSchema = z
  .object({
    _key: z.string().optional(),
    fieldId: z.string().optional().default(""),
    title: z.string().default(""),
    link: optionalHttpUrlSchema,
    image: z.any().optional(),
    imageUrl: z.string().optional().default(""),
  })
  .superRefine((entry, ctx) => {
    const title = String(entry.title || "").trim();
    const link = String(entry.link || "").trim();
    const hasAnyValue = Boolean(title || link || entry.image || entry.imageUrl);

    if (!hasAnyValue) return;

    if (!title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "عنوان العمل مطلوب.",
      });
    }
  });

/**
 * Default values for a new portfolio project row.
 */
export const portfolioProjectDefaults = {
  _key: undefined,
  fieldId: "",
  title: "",
  link: "",
  image: null,
  imageUrl: "",
};
