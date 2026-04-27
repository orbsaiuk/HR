import { Github, Globe, Instagram, Linkedin, Twitter } from "lucide-react";

export const SOCIAL_PLATFORMS = [
  {
    key: "linkedinUrl",
    type: "linkedin",
    label: "لينكدإن",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/...",
  },
  {
    key: "githubUrl",
    type: "github",
    label: "جيت\u200Cهاب",
    icon: Github,
    placeholder: "https://github.com/...",
  },
  {
    key: "twitterUrl",
    type: "twitter",
    label: "تويتر / X",
    icon: Twitter,
    placeholder: "https://x.com/...",
  },
  {
    key: "instagramUrl",
    type: "instagram",
    label: "إنستغرام",
    icon: Instagram,
    placeholder: "https://instagram.com/...",
  },
  {
    key: "websiteUrl",
    type: "website",
    label: "موقعي الشخصي",
    icon: Globe,
    placeholder: "https://...",
  },
];

export function getSocialPlatformByType(type) {
  return SOCIAL_PLATFORMS.find((entry) => entry.type === type);
}

export function buildSocialLinks(profile = {}) {
  return SOCIAL_PLATFORMS
    .map(({ key, type, label }) => {
      const url = profile[key] || "";
      return {
        platform: label,
        platformKey: key,
        value: url.replace(/^https?:\/\//, ""),
        url,
        type,
      };
    })
    .filter((entry) => entry.url);
}
