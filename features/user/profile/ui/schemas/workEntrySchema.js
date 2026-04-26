import { z } from "zod";

/**
 * Zod validation schema for a single work experience entry.
 */
export const workEntrySchema = z.object({
    company: z.string().min(1, "اسم الشركة مطلوب"),
    title: z.string().min(1, "المسمى الوظيفي مطلوب"),
    startDate: z.string().min(1, "تاريخ البداية مطلوب"),
    endDate: z.string().optional().default(""),
    isCurrent: z.boolean().optional().default(false),
    description: z.string().optional().default(""),
});

/**
 * Default values for a new work entry.
 */
export const workEntryDefaults = {
    company: "",
    title: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
};
