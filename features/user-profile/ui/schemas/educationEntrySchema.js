import { z } from "zod";

/**
 * Zod validation schema for a single education entry.
 */
export const educationEntrySchema = z.object({
    institution: z.string().min(1, "Institution is required"),
    degree: z.string().min(1, "Degree is required"),
    fieldOfStudy: z.string().optional().default(""),
    startDate: z.string().optional().default(""),
    endDate: z.string().optional().default(""),
    grade: z.string().optional().default(""),
});

/**
 * Default values for a new education entry.
 */
export const educationEntryDefaults = {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    grade: "",
};
