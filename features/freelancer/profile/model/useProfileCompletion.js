"use client";

import { useMemo } from "react";

/**
 * Profile completion items — mirrors the items defined in ProfileCompletionBanner.
 * Kept in one place so both the banner and any other consumer can use them.
 */
export const PROFILE_COMPLETION_ITEMS = [
  {
    key: "headline",
    label: "المسمى المهني",
    section: "header",
    isComplete: (profile) => Boolean(profile?.headline),
  },
  {
    key: "bio",
    label: "نبذة عنك",
    section: "about",
    isComplete: (profile) => Boolean(profile?.bio),
  },
  {
    key: "skills",
    label: "المهارات",
    section: "skills",
    isComplete: (profile) => (profile?.skills || []).length > 0,
  },
  {
    key: "services",
    label: "خدمة واحدة على الأقل",
    section: "services",
    isComplete: (profile) => (profile?.services || []).length > 0,
  },
  {
    key: "portfolio",
    label: "عمل واحد على الأقل",
    section: "portfolio",
    isComplete: (profile) => (profile?.portfolioProjects || []).length > 0,
  },
  {
    key: "details",
    label: "رقم الهاتف",
    section: "details",
    isComplete: (profile) => Boolean(profile?.phone),
  },
  {
    key: "social",
    label: "روابط التواصل",
    section: "social",
    isComplete: (profile) => (profile?.socialLinks || []).length > 0,
  },
];

/** Pure function — can be used without React */
export function getProfileCompletion(profile) {
  const items = PROFILE_COMPLETION_ITEMS.map((item) => ({
    ...item,
    complete: item.isComplete(profile),
  }));
  const completedCount = items.filter((item) => item.complete).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return {
    percentage,
    completedCount,
    totalCount: items.length,
    missing: items.filter((item) => !item.complete),
  };
}

/** Threshold at which the banner hides itself */
export const PROFILE_COMPLETION_THRESHOLD = 60;

/**
 * Hook: computes profile completion and exposes threshold check.
 * Safe to call even when profile is null/undefined — returns 0%.
 */
export function useProfileCompletion(profile) {
  const { percentage, missing, completedCount, totalCount } = useMemo(
    () => getProfileCompletion(profile),
    [profile],
  );

  const isBelowThreshold = percentage < PROFILE_COMPLETION_THRESHOLD;

  return {
    percentage,
    missing,
    completedCount,
    totalCount,
    isBelowThreshold,
  };
}
