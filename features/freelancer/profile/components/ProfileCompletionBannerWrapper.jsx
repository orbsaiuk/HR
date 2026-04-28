"use client";

import { usePathname, useRouter } from "next/navigation";

import { useFreelancerProfileContext } from "../providers/FreelancerProfileContext";
import { useProfileCompletion } from "../model/useProfileCompletion";
import { ProfileCompletionBanner } from "./ProfileCompletionBanner";

export function ProfileCompletionBannerWrapper() {
  const { profile, loading } = useFreelancerProfileContext();
  const { isBelowThreshold, missing } = useProfileCompletion(profile);
  const pathname = usePathname();
  const router = useRouter();

  const isOnProfilePage = pathname === "/freelancer/profile";

  if (loading) {
    return (
      <div className="mb-4 h-28 animate-pulse rounded-2xl bg-slate-100 sm:mb-6" />
    );
  }

  if (!isBelowThreshold || missing.length === 0) return null;

  function handleCompleteProfile() {
    router.push("/freelancer/profile");
  }

  return (
    <ProfileCompletionBanner
      profile={profile}
      onCompleteProfile={handleCompleteProfile}
      hideAction={isOnProfilePage}
    />
  );
}
