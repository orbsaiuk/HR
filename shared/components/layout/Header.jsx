"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
import { UserButton, SignUpButton, useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Building2, Clock, MessageSquare, User } from "lucide-react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isSignedIn, isTeamMember, isUser, isUserLoaded } = useAuth();
  const { unreadCount } = useUnreadCount(Boolean(isSignedIn && isUser));
  const showOrgLink = isSignedIn && isUserLoaded && isUser && !isTeamMember;
  const { requests, loading: orgRequestLoading } = useOrgRequest(Boolean(isSignedIn && isUserLoaded && isUser));
  // Only call useOrganization and useOrganizationList when signed in
  const { organization } = useOrganization();
  const { userMemberships, setActive, isLoaded: isOrgListLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const router = useRouter();
  const hasPendingRequest = showOrgLink && requests.some(
    (r) => r.status === "pending"
  );
  const hasApprovedRequest = showOrgLink && requests.some(
    (r) => r.status === "approved"
  );
  const hasOrgRequest = hasPendingRequest || hasApprovedRequest;
  // While org request data is loading for a signed-in user, hide conditional nav to prevent flash
  const isNavReady = !isSignedIn || !isUserLoaded || !isUser || !orgRequestLoading;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          HireHub
        </Link>

        <nav className="flex items-center gap-6">
          {isNavReady && (
            <>
              {/* Public links */}
              <Link
                href="/careers"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse Jobs
              </Link>
              {/* Organization link — show dashboard, request status, or register option */}
              {showOrgLink && (
                hasApprovedRequest ? (
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 cursor-pointer"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (isOrgListLoaded && setActive && userMemberships?.data?.length) {
                        try {
                          await setActive({ organization: userMemberships.data[0].organization.id });
                          window.location.href = "/dashboard";
                        } catch (err) {
                          console.error("Failed to activate organization:", err);
                          router.push("/dashboard");
                        }
                      } else {
                        router.push("/dashboard");
                      }
                    }}
                  >
                    Dashboard
                  </a>
                ) : hasPendingRequest ? (
                  <Link
                    href="/user/organization-requests"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <Clock size={16} />
                    Org Request
                  </Link>
                ) : (
                  <Link
                    href="/register-organization"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <Building2 size={16} />
                    Register Organization
                  </Link>
                )
              )}

              {/* Team member links */}
              {isSignedIn && isUserLoaded && isTeamMember && (
                <a
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                  onClick={async (e) => {
                    e.preventDefault();
                    // If org is already active, navigate directly
                    if (organization) {
                      router.push("/dashboard");
                      return;
                    }
                    // Try to activate the user's organization first
                    if (isOrgListLoaded && setActive && userMemberships?.data?.length) {
                      try {
                        await setActive({ organization: userMemberships.data[0].organization.id });
                        window.location.href = "/dashboard";
                      } catch (err) {
                        console.error("Failed to activate organization:", err);
                        router.push("/dashboard");
                      }
                    } else {
                      router.push("/dashboard");
                    }
                  }}
                >
                  Dashboard
                </a>
              )}

              {/* Regular user links */}
              {isSignedIn && isUserLoaded && isUser && (
                <>
                  <Link
                    href="/user/profile"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  {!hasOrgRequest && (
                    <Link
                      href="/my-applications"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      My Applications
                    </Link>
                  )}
                  {!hasOrgRequest && (
                    <Link
                      href="/messages"
                      className="relative text-gray-600 hover:text-gray-900 transition-colors p-2"
                      aria-label="Messages"
                    >
                      <MessageSquare size={24} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  )}
                </>
              )}
            </>
          )}

          {/* Auth button */}
          {!isSignedIn && (
            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          )}

          {isSignedIn && <UserButton />}
        </nav>
      </div>
    </header>
  );
}
