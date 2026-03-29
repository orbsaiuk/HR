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
  const {
    isSignedIn,
    isTeamMember,
    isUser,
    isUserLoaded,
    accountType,
    isJobSeeker,
    isFreelancer,
  } = useAuth();
  const { unreadCount } = useUnreadCount(Boolean(isSignedIn && isUser));
  const showOrgLink = isSignedIn && isUserLoaded && isUser && !isTeamMember;
  // Fetch org requests for ALL signed-in users (including untyped users in minimal mode)
  const { requests, loading: orgRequestLoading } = useOrgRequest(
    Boolean(isSignedIn && isUserLoaded),
  );
  const { organization } = useOrganization();
  const {
    userMemberships,
    setActive,
    isLoaded: isOrgListLoaded,
  } = useOrganizationList({ userMemberships: { infinite: true } });
  const router = useRouter();
  const pathname = usePathname();
  const isOrgFlowPath =
    pathname.startsWith("/register-organization") ||
    pathname.startsWith("/user/organization-requests");
  const isUntypedSignedInUser = Boolean(
    isSignedIn && isUserLoaded && !isTeamMember && !accountType,
  );
  const isMinimalHeaderMode = isUntypedSignedInUser;

  // Check if user has any pending/approved org request (for all signed-in users)
  const hasPendingRequest = requests.some((r) => r.status === "pending");
  const hasApprovedRequest = requests.some((r) => r.status === "approved");
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
    const companyDashboardPath = "/company";

    if (organization) {
      router.push(companyDashboardPath);
      return;
    }
    if (isOrgListLoaded && setActive && userMemberships?.data?.length) {
      try {
        await setActive({
          organization: userMemberships.data[0].organization.id,
        });
        window.location.href = companyDashboardPath;
      } catch {
        router.push(companyDashboardPath);
      }
    } else {
      router.push(companyDashboardPath);
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
    isMinimalHeaderMode,
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
