"use client";

import { useState, useEffect, useCallback } from "react";
import { userProfileApi } from "../api/userProfileApi";

/**
 * Compute a completion percentage from the completeness data.
 * Different fields are required based on account type.
 */
function computePercentage(data) {
  if (!data) return 0;

  const isFreelancer = data.accountType === "freelancer";

  const commonChecks = [
    !!data.name,
    !!data.email,
    !!data.phone,
    !!data.headline,
    !!data.bio,
    !!data.location,
    !!data.hasSkills,
  ];

  const typeChecks = isFreelancer
    ? [!!data.hasPortfolio] // Freelancer: portfolio required
    : [!!data.hasResume, !!data.hasWorkExperience, !!data.hasEducation]; // Job Seeker: resume, work exp, education

  const checks = [...commonChecks, ...typeChecks];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

/**
 * Identify which sections are still missing based on account type.
 */
function getMissingSections(data) {
  if (!data) return [];

  const isFreelancer = data.accountType === "freelancer";
  const sections = [];

  // Common fields
  if (!data.phone) sections.push("رقم الهاتف");
  if (!data.headline) sections.push("العنوان المهني");
  if (!data.bio) sections.push("النبذة التعريفية");
  if (!data.location) sections.push("الموقع");
  if (!data.hasSkills) sections.push("المهارات");

  if (isFreelancer) {
    if (!data.hasPortfolio) sections.push("رابط معرض الأعمال");
  } else {
    if (!data.hasResume) sections.push("السيرة الذاتية");
    if (!data.hasWorkExperience) sections.push("الخبرات العملية");
    if (!data.hasEducation) sections.push("التعليم");
  }

  return sections;
}

/**
 * Hook to track profile completeness.
 */
export function useProfileCompletion() {
  const [completeness, setCompleteness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompleteness = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userProfileApi.getCompleteness();
      setCompleteness(data);
    } catch (err) {
      setError(err.message || "فشل في تحميل بيانات اكتمال الملف الشخصي");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompleteness();

    const handleProfileUpdate = () => {
      fetchCompleteness();
    };

    window.addEventListener("profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("profile_updated", handleProfileUpdate);
    };
  }, [fetchCompleteness]);

  const percentage = computePercentage(completeness);
  const missingSections = getMissingSections(completeness);
  const isComplete = percentage === 100;

  return {
    completeness,
    percentage,
    missingSections,
    isComplete,
    loading,
    error,
    refetch: fetchCompleteness,
  };
}
