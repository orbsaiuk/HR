import { z } from "zod";

function isHttpUrl(value = "") {
  if (!value) return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Allows empty strings or absolute http/https URLs.
 */
export const optionalHttpUrlSchema = z
  .string()
  .default("")
  .transform((value) => value.trim())
  .refine((value) => isHttpUrl(value), {
    message: "أدخل رابطاً يبدأ بـ http أو https.",
  });
