"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";

/**
 * Encapsulates all auth, organization, and mobile-menu state
 * needed by the public Header.
 */
export function useHeaderState() {
  const { isSignedIn, isTeamMember, isUser, isUserLoaded, accountType, isJobSeeker, isFreelancer } = useAuth();
  const { unreadCount } = useUnreadCount(Boolean(isSignedIn && isUser));
  const showOrgLink = isSignedIn && isUserLoaded && isUser && !isTeamMember;
  const { requests, loading: orgRequestLoading } = useOrgRequest(
    Boolean(isSignedIn && isUserLoaded && isUser),
  );
  const { organization } = useOrganization();
  const {
    userMemberships,
    setActive,
    isLoaded: isOrgListLoaded,
  } = useOrganizationList({ userMemberships: { infinite: true } });
  const router = useRouter();
  const pathname = usePathname();

  const hasPendingRequest =
    showOrgLink && requests.some((r) => r.status === "pending");
  const hasApprovedRequest =
    showOrgLink && requests.some((r) => r.status === "approved");
  const hasOrgRequest = hasPendingRequest || hasApprovedRequest;
  // Nav is ready immediately for unauthenticated users.
  // For signed-in users, wait only until user and org-request data are loaded.
  const isNavReady = !isSignedIn || (!orgRequestLoading && isUserLoaded);

  /* ── mobile menu ── */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  /* ── dashboard navigation helper ── */
  async function navigateToDashboard() {
    if (organization) {
      router.push("/dashboard");
      return;
    }
    if (isOrgListLoaded && setActive && userMemberships?.data?.length) {
      try {
        await setActive({
          organization: userMemberships.data[0].organization.id,
        });
        window.location.href = "/dashboard";
      } catch {
        router.push("/dashboard");
      }
    } else {
      router.push("/dashboard");
    }
  }

  return {
    isSignedIn,
    isTeamMember,
    isUser,
    isUserLoaded,
    accountType,
    isJobSeeker,
    isFreelancer,
    unreadCount,
    showOrgLink,
    hasPendingRequest,
    hasApprovedRequest,
    hasOrgRequest,
    isNavReady,
    mobileMenuOpen,
    setMobileMenuOpen,
    navigateToDashboard,
    pathname,
  };
}
