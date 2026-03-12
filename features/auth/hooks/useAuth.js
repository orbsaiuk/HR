"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const role = user?.publicMetadata?.role;
  const accountType = user?.publicMetadata?.accountType;

  return {
    ...clerkAuth,
    isUserLoaded,
    role,
    accountType,
    isTeamMember: role === "teamMember",
    isUser: role === "user" || (clerkAuth.isSignedIn && !role),
    isJobSeeker: accountType === "jobSeeker",
    isFreelancer: accountType === "freelancer",
  };
}
