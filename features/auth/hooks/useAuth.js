"use client";

import { useAuth as useClerkAuth } from "@clerk/nextjs";

export function useAuth() {
  const clerkAuth = useClerkAuth();

  return {
    ...clerkAuth,
    isTeamMember: clerkAuth.user?.publicMetadata?.role === "teamMember",
    isUser: clerkAuth.user?.publicMetadata?.role === "user",
  };
}
