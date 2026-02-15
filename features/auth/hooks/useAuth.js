"use client";

import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

export function useAuth() {
  const clerkAuth = useClerkAuth();
  const { user, isLoaded: isUserLoaded } = useUser();

  const role = user?.publicMetadata?.role;

  return {
    ...clerkAuth,
    isUserLoaded,
    role,
    isTeamMember: role === "teamMember",
    isUser: role === "user" || (clerkAuth.isSignedIn && !role),
  };
}
