import { z } from "zod";

/**
 * Zod validation schema for a single freelancer service entry.
 */
export const serviceEntrySchema = z
  .object({
    _key: z.string().optional(),
    title: z.string().default(""),
    description: z.string().default(""),
    price: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .optional(),
    deliveryTime: z.string().default(""),
  })
  .superRefine((entry, ctx) => {
    const title = String(entry.title || "").trim();
    const description = String(entry.description || "").trim();
    const deliveryTime = String(entry.deliveryTime || "").trim();
    const rawPrice = entry.price == null ? "" : String(entry.price).trim();

    const hasAnyValue = Boolean(
      title || description || deliveryTime || rawPrice,
    );
    if (!hasAnyValue) return;

    if (!title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["title"],
        message: "عنوان الخدمة مطلوب.",
      });
    }

    if (rawPrice) {
      const parsedPrice = Number(rawPrice);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["price"],
          message: "السعر يجب أن يكون رقماً يساوي 0 أو أكثر.",
        });
      }
    }
  });

/**
 * Default values for a new service row.
 */
export const serviceEntryDefaults = {
  _key: undefined,
  title: "",
  description: "",
  price: "",
  deliveryTime: "",
};
