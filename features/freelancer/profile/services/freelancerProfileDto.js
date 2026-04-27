import { buildSocialLinks } from "../lib/socialPlatforms";
import {
  normalizeLanguagesForUi,
  normalizePortfolioForUi,
  normalizeServicesForUi,
} from "./freelancerProfileNormalizers";

export const PROFILE_FIELDS = [
  "phone",
  "headline",
  "bio",
  "location",
  "skills",
  "languages",
  "linkedinUrl",
  "githubUrl",
  "twitterUrl",
  "instagramUrl",
  "websiteUrl",
  "services",
  "portfolioProjects",
];

export function toFreelancerProfileDto(user, profile) {
  return {
    _id: profile._id,
    userId: user._id,
    name: user.name || "",
    email: user.email || "",
    avatar: user.avatar || "",
    accountType: user.accountType || "",
    phone: profile.phone || "",
    headline: profile.headline || "",
    bio: profile.bio || "",
    location: profile.location || "",
    skills: profile.skills || [],
    languages: normalizeLanguagesForUi(profile.languages),
    linkedinUrl: profile.linkedinUrl || "",
    githubUrl: profile.githubUrl || "",
    twitterUrl: profile.twitterUrl || "",
    instagramUrl: profile.instagramUrl || "",
    websiteUrl: profile.websiteUrl || "",
    socialLinks: buildSocialLinks(profile),
    services: normalizeServicesForUi(profile.services),
    portfolioProjects: normalizePortfolioForUi(profile.portfolioProjects),
    createdAt: profile.createdAt || profile._createdAt,
    updatedAt: profile.updatedAt || profile._updatedAt,
  };
}
