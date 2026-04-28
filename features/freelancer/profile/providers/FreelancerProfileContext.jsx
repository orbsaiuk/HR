"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { freelancerProfileApi } from "../api/freelancerProfileApi";

export const FreelancerProfileContext = createContext(null);

export function FreelancerProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await freelancerProfileApi.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message || "فشل تحميل الملف الشخصي");
      // Fail silently — don't surface errors to the UI.
      // The banner will show at 0% which is still informative.
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Listen for profile_updated events dispatched by useFreelancerProfile
  // so the banner refreshes in real-time when the user edits their profile.
  useEffect(() => {
    function handleProfileUpdated() {
      fetchProfile();
    }
    window.addEventListener("profile_updated", handleProfileUpdated);
    return () => window.removeEventListener("profile_updated", handleProfileUpdated);
  }, [fetchProfile]);

  const refetch = useCallback(() => fetchProfile(), [fetchProfile]);

  const value = useMemo(
    () => ({ profile, loading, error, refetch }),
    [profile, loading, error, refetch],
  );

  return (
    <FreelancerProfileContext.Provider value={value}>
      {children}
    </FreelancerProfileContext.Provider>
  );
}

/**
 * Must be called within <FreelancerProfileProvider>.
 * Returns { profile, loading, error, refetch }.
 */
export function useFreelancerProfileContext() {
  const ctx = useContext(FreelancerProfileContext);
  if (!ctx) {
    throw new Error(
      "useFreelancerProfileContext must be used within FreelancerProfileProvider",
    );
  }
  return ctx;
}
