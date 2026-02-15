import { z } from "zod";

/**
 * Zod validation schema for the user profile edit form.
 */
export const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional().default(""),
    headline: z.string().optional().default(""),
    bio: z.string().optional().default(""),
    location: z.string().optional().default(""),
    dateOfBirth: z.string().optional().default(""),
    resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    workExperience: z.array(z.any()).optional().default([]),
    education: z.array(z.any()).optional().default([]),
    skills: z.array(z.string()).optional().default([]),
    languages: z.array(z.any()).optional().default([]),
});

/**
 * Default values matching the schema shape.
 */
export const profileDefaults = {
    name: "",
    phone: "",
    headline: "",
    bio: "",
    location: "",
    dateOfBirth: "",
    resumeUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
};
