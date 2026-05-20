import { z } from "zod";
import { optionalHttpUrlSchema } from "./optionalHttpUrlSchema";
import { portfolioProjectSchema } from "./portfolioProjectSchema";
import { serviceEntrySchema } from "./serviceEntrySchema";

export const freelancerProfileEditSchema = z.object({
  name: z.string().default(""),
  headline: z.string().default(""),
  location: z.string().default(""),
  category: z.string().default(""),
  subcategory: z.string().default(""),
  bio: z.string().default(""),
  phone: z.string().default(""),
  skills: z.array(z.string()).default([]),
  linkedinUrl: optionalHttpUrlSchema,
  githubUrl: optionalHttpUrlSchema,
  instagramUrl: optionalHttpUrlSchema,
  twitterUrl: optionalHttpUrlSchema,
  websiteUrl: optionalHttpUrlSchema,
  services: z.array(serviceEntrySchema).default([]),
  portfolioProjects: z.array(portfolioProjectSchema).default([]),
});
