"use client";

import Link from "next/link";
import { UserButton, SignUpButton } from "@clerk/nextjs";
import { Clock, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLink } from "./DashboardLink";
import { cn } from "@/lib/utils";

function isNavActive(href, pathname) {
  if (href === "/") return pathname === "/";
  if (href === "#") return false;
  return pathname.startsWith(href);
}

export function DesktopNav({
  isSignedIn,
  isUser,
  isUserLoaded,
  isTeamMember,
  isNavReady,
  isFreelancer,
  unreadCount,
  showOrgLink,
  hasPendingRequest,
  hasApprovedRequest,
  hasOrgRequest,
  navigateToDashboard,
  pathname,
}) {
  return (
    <div className="hidden md:flex items-center gap-6 order-first">
      {/* CTA Buttons */}
      <div className="flex items-center gap-3">
        {!isSignedIn && (
          <>
            <Link href="/register-organization">
              <Button className="rounded-full bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 text-sm">
                ابدأ كشركة
              </Button>
            </Link>
            <SignUpButton mode="modal">
              <Button
                variant="outline"
                className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 text-sm"
              >
                إنشاء حساب
              </Button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && <UserButton />}
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center gap-8">
        {/* Auth-specific links: only render once loading is complete */}
        {isNavReady && (
          <>
            {/* User profile & messages */}
            {isSignedIn && isUserLoaded && isUser && (
              <>
                {!hasOrgRequest && (
                  <Link
                    href="/messages"
                    className="relative text-gray-700 hover:text-gray-900 transition-colors p-2"
                    aria-label="الرسائل"
                  >
                    <MessageSquare size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -start-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                )}
                <NavLink href="/user/profile" pathname={pathname}>
                  الملف الشخصي
                </NavLink>
              </>
            )}

            {/* Organization request status */}
            {showOrgLink &&
              (hasApprovedRequest ? (
                <DashboardLink
                  navigateToDashboard={navigateToDashboard}
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                />
              ) : hasPendingRequest ? (
                <Link
                  href="/user/organization-requests"
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-1"
                >
                  <Clock size={16} />
                  طلب المنظمة
                </Link>
              ) : null)}

            {/* Team member dashboard link */}
            {isSignedIn && isUserLoaded && isTeamMember && (
              <DashboardLink
                navigateToDashboard={navigateToDashboard}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
              />
            )}
          </>
        )}

        {/* Public links: always visible immediately */}
        <NavLink href="/" pathname={pathname}>
          الرئيسية
        </NavLink>
        <NavLink
          href={isFreelancer ? "/projects" : "/careers"}
          pathname={pathname}
        >
          {isFreelancer ? "المشاريع" : "الوظائف"}
        </NavLink>
        <NavLink href="#" pathname={pathname}>
          تواصل معنا
        </NavLink>
      </nav>
    </div>
  );
}

/* ── helper component ── */

function NavLink({ href, pathname, children }) {
  const active = isNavActive(href, pathname);
  return (
    <Link
      href={href}
      className={cn(
        "transition-colors font-medium",
        active ? "text-[#5286A5]" : "text-gray-700 hover:text-gray-900",
      )}
    >
      {children}
    </Link>
  );
}
