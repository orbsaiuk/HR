import { z } from "zod";

/**
 * Zod validation schema for a single work experience entry.
 */
export const workEntrySchema = z.object({
    company: z.string().min(1, "Company is required"),
    title: z.string().min(1, "Job title is required"),
    startDate: z.string().min(1, "Start date is required"),
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
