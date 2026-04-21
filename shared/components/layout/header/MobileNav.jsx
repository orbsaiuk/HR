"use client";

import Link from "next/link";
import { UserButton, SignUpButton } from "@clerk/nextjs";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLink } from "./DashboardLink";
import { cn } from "@/lib/utils";

function isNavActive(href, pathname) {
  if (href === "/") return pathname === "/";
  if (href === "#") return false;
  return pathname.startsWith(href);
}

export function MobileNav({
  isOpen,
  onClose,
  isSignedIn,
  isUser,
  isUserLoaded,
  isTeamMember,
  isMinimalHeaderMode,
  isFreelancer,
  unreadCount,
  hasOrgRequest,
  hasPendingRequest,
  hasApprovedRequest,
  hasOrgRegistrationDraft,
  navigateToDashboard,
  pathname,
}) {
  const showContinueRegistration = Boolean(
    isSignedIn &&
    isUserLoaded &&
    isUser &&
    !hasOrgRequest &&
    hasOrgRegistrationDraft,
  );

  if (isMinimalHeaderMode) {
    return (
      <div
        className={`md:hidden fixed inset-x-0 top-13 sm:top-15 bottom-0 bg-white z-40 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-1 overflow-y-auto max-h-full">
          {/* Hide "Start as company" button if user already has a pending/approved request */}
          {!hasOrgRequest && (
            <Link href="/register-organization">
              <Button className="w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white h-11">
                {hasOrgRegistrationDraft ? "اكمل التسجيل" : "ابدأ كشركة"}
              </Button>
            </Link>
          )}

          {/* Show pending request link instead */}
          {hasPendingRequest && (
            <Link
              href="/user/organization-requests"
              className={cn(
                "flex items-center gap-2 font-medium py-3 px-3 rounded-lg transition-colors",
                isNavActive("/user/organization-requests", pathname)
                  ? "text-blue-700 bg-blue-50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <Clock size={16} />
              طلب التسجيل
            </Link>
          )}

          {isSignedIn && (
            <div className="pt-4 border-t border-gray-100 mt-3 px-3">
              <HeaderUserButton
                showContinueRegistration={showContinueRegistration}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`md:hidden fixed inset-x-0 top-13 sm:top-15 bottom-0 bg-white z-40 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="px-4 py-6 space-y-1 overflow-y-auto max-h-full">
        {/* Public links */}
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

        {/* Signed-in user links */}
        {isSignedIn && isUserLoaded && isUser && (
          <>
            <Divider />
            {!hasOrgRequest && hasOrgRegistrationDraft && (
              <NavLink href="/register-organization" pathname={pathname}>
                اكمل التسجيل
              </NavLink>
            )}
            {!hasOrgRequest && !isFreelancer && (
              <NavLink href="/user/profile" pathname={pathname}>
                الملف الشخصي
              </NavLink>
            )}
            <NavLink href="/my-applications" pathname={pathname}>
              طلباتي
            </NavLink>

            {!hasOrgRequest && (
              <Link
                href="/messages"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors"
              >
                الرسائل
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {hasApprovedRequest && (
              <DashboardLink
                navigateToDashboard={navigateToDashboard}
                className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors"
                onBeforeNavigate={onClose}
              />
            )}

            {hasPendingRequest && !hasApprovedRequest && (
              <Link
                href="/user/organization-requests"
                className={cn(
                  "flex items-center gap-2 font-medium py-3 px-3 rounded-lg transition-colors",
                  isNavActive("/user/organization-requests", pathname)
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <Clock size={16} />
                طلب التسجيل
              </Link>
            )}

            {isFreelancer && (
              <NavLink href="/freelancer" pathname={pathname}>
                لوحة التحكم
              </NavLink>
            )}
          </>
        )}

        {/* Team member dashboard */}
        {isSignedIn && isUserLoaded && isTeamMember && (
          <>
            <Divider />
            <DashboardLink
              navigateToDashboard={navigateToDashboard}
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors"
              onBeforeNavigate={onClose}
            />
          </>
        )}

        {/* Guest CTA */}
        {!isSignedIn && (
          <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-3">
            <Link href="/register-organization">
              <Button className="w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white h-11">
                ابدأ كشركة
              </Button>
            </Link>
            <SignUpButton mode="modal">
              <Button
                variant="outline"
                className="w-full rounded-full border-gray-300 h-11"
              >
                إنشاء حساب
              </Button>
            </SignUpButton>
          </div>
        )}

        {/* User button */}
        {isSignedIn && (
          <div className="pt-4 border-t border-gray-100 mt-3 px-3">
            <HeaderUserButton
              showContinueRegistration={showContinueRegistration}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── tiny helpers ── */

function NavLink({ href, pathname, children }) {
  const active = isNavActive(href, pathname);
  return (
    <Link
      href={href}
      className={cn(
        "block font-medium py-3 px-3 rounded-lg transition-colors",
        active
          ? "text-blue-700 bg-blue-50"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
      )}
    >
      {children}
    </Link>
  );
}

function Divider() {
  return <div className="border-t border-gray-100 my-3" />;
}

function HeaderUserButton({ showContinueRegistration }) {
  return (
    <UserButton
      key={
        showContinueRegistration
          ? "mobile-user-button-with-continue-registration"
          : "mobile-user-button-default"
      }
    >
      {showContinueRegistration && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="اكمل التسجيل"
            href="/register-organization"
            labelIcon={<Clock size={16} />}
          />
        </UserButton.MenuItems>
      )}
    </UserButton>
  );
}
