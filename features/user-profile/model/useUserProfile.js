"use client";

import { useState, useEffect, useCallback } from "react";
import { userProfileApi } from "../api/userProfileApi";

/**
 * Hook to fetch and manage the current user's profile.
 */
export function useUserProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userProfileApi.getProfile();
            setProfile(data);
        } catch (err) {
            setError(err.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    /**
     * Update profile fields.
     * @param {object} data - Fields to update
     */
    const updateProfile = useCallback(async (data) => {
        try {
            setSaving(true);
            setError(null);
            const updated = await userProfileApi.updateProfile(data);
            setProfile(updated);
            return updated;
        } catch (err) {
            setError(err.message || "Failed to update profile");
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    /**
     * Upload a resume file.
     * @param {File} file
     */
    const uploadResume = useCallback(async (file) => {
        try {
            setSaving(true);
            setError(null);
            const formData = new FormData();
            formData.append("file", file);
            const updated = await userProfileApi.uploadResume(formData);
            setProfile(updated);
            return updated;
        } catch (err) {
            setError(err.message || "Failed to upload resume");
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    /**
     * Remove the uploaded resume file.
     */
    const removeResume = useCallback(async () => {
        try {
            setSaving(true);
            setError(null);
            const updated = await userProfileApi.removeResume();
            setProfile(updated);
            return updated;
        } catch (err) {
            setError(err.message || "Failed to remove resume");
            throw err;
        } finally {
            setSaving(false);
        }
    }, []);

    return {
        profile,
        loading,
        error,
        saving,
        updateProfile,
        uploadResume,
        removeResume,
        refetch: fetchProfile,
    };
}
