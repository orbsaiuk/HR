"use client";

import { useCallback, useEffect, useState } from "react";

import { freelancerProfileApi } from "../api/freelancerProfileApi";

export function useFreelancerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await freelancerProfileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || "Failed to load freelancer profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (data) => {
    try {
      setSaving(true);
      setError(null);
      const updated = await freelancerProfileApi.updateProfile(data);
      setProfile(updated);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("profile_updated"));
      }

      return updated;
    } catch (err) {
      setError(err.message || "Failed to update freelancer profile");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadPortfolioImage = useCallback(async (file) => {
    try {
      setSaving(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      return await freelancerProfileApi.uploadPortfolioImage(formData);
    } catch (err) {
      setError(err.message || "Failed to upload portfolio image");
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    profile,
    loading,
    saving,
    error,
    refetch: fetchProfile,
    updateProfile,
    uploadPortfolioImage,
  };
}
