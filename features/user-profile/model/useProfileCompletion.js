"use client";

import { useState, useEffect, useCallback } from "react";
import { userProfileApi } from "../api/userProfileApi";

/**
 * Compute a completion percentage from the completeness data.
 */
function computePercentage(data) {
    if (!data) return 0;

    const checks = [
        !!data.name,
        !!data.email,
        !!data.phone,
        !!data.headline,
        !!data.bio,
        !!data.location,
        !!data.hasResume,
        !!data.hasWorkExperience,
        !!data.hasEducation,
        !!data.hasSkills,
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
}

/**
 * Identify which sections are still missing.
 */
function getMissingSections(data) {
    if (!data) return [];

    const sections = [];
    if (!data.phone) sections.push("Phone number");
    if (!data.headline) sections.push("Headline");
    if (!data.bio) sections.push("Bio / About me");
    if (!data.location) sections.push("Location");
    if (!data.hasResume) sections.push("Resume / CV");
    if (!data.hasWorkExperience) sections.push("Work experience");
    if (!data.hasEducation) sections.push("Education");
    if (!data.hasSkills) sections.push("Skills");
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
            setError(err.message || "Failed to load profile completeness");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCompleteness();
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
