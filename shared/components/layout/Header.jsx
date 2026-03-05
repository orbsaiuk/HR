"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
import { UserButton, SignUpButton, useOrganizationList, useOrganization } from "@clerk/nextjs";
import { Clock, MessageSquare, User, Menu, X } from "lucide-react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Header() {
  const { isSignedIn, isTeamMember, isUser, isUserLoaded } = useAuth();
  const { unreadCount } = useUnreadCount(Boolean(isSignedIn && isUser));
  const showOrgLink = isSignedIn && isUserLoaded && isUser && !isTeamMember;
  const { requests, loading: orgRequestLoading } = useOrgRequest(Boolean(isSignedIn && isUserLoaded && isUser));
  const { organization } = useOrganization();
  const { userMemberships, setActive, isLoaded: isOrgListLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const router = useRouter();
  const pathname = usePathname();
  const hasPendingRequest = showOrgLink && requests.some(
    (r) => r.status === "pending"
  );
  const hasApprovedRequest = showOrgLink && requests.some(
    (r) => r.status === "approved"
  );
  const hasOrgRequest = hasPendingRequest || hasApprovedRequest;
  const isNavReady = !isSignedIn || !isUserLoaded || !isUser || !orgRequestLoading;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo - End side (left in RTL) */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 order-last"
        >
          <span className="font-heading">HireHub</span>
        </Link>

        {/* Desktop Navigation & CTA Buttons */}
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
                  <Button variant="outline" className="rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 text-sm">
                    سجل كباحث عن عمل
                  </Button>
                </SignUpButton>
              </>
            )}

            {isSignedIn && <UserButton />}
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
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
                    <Link
                      href="/user/profile"
                      className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-1 font-medium"
                    >
                      <User size={16} />
                      ملفي
                    </Link>
                  </>
                )}

                {/* Organization request status */}
                {showOrgLink && (
                  hasApprovedRequest ? (
                    <a
                      href="/dashboard"
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-1 cursor-pointer"
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
                      لوحة التحكم
                    </a>
                  ) : hasPendingRequest ? (
                    <Link
                      href="/user/organization-requests"
                      className="text-gray-700 hover:text-gray-900 transition-colors font-medium flex items-center gap-1"
                    >
                      <Clock size={16} />
                      طلب المنظمة
                    </Link>
                  ) : null
                )}

                {/* Team member dashboard link */}
                {isSignedIn && isUserLoaded && isTeamMember && (
                  <a
                    href="/dashboard"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium cursor-pointer"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (organization) {
                        router.push("/dashboard");
                        return;
                      }
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
                    لوحة التحكم
                  </a>
                )}
                <Link
                  href="/"
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  الرئيسية
                </Link>
                <Link
                  href="/companies"
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  الشركات
                </Link>
                <Link
                  href="#"
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  تواصل معنا
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-700 order-first rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="القائمة"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation - Slide down overlay */}
      <div
        className={`md:hidden fixed inset-x-0 top-[52px] sm:top-[60px] bottom-0 bg-white z-40 transition-all duration-300 ease-in-out ${mobileMenuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        <div className="px-4 py-6 space-y-1 overflow-y-auto max-h-full">
          <Link href="/" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
            الرئيسية
          </Link>
          <Link href="/careers" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
            الوظائف
          </Link>
          <Link href="/companies" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
            الشركات
          </Link>
          <Link href="#" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
            تواصل معنا
          </Link>

          {isSignedIn && isUserLoaded && isUser && (
            <>
              <div className="border-t border-gray-100 my-3" />
              <Link href="/user/profile" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
                ملفي
              </Link>
              <Link href="/my-applications" className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
                طلباتي
              </Link>
              {!hasOrgRequest && (
                <Link href="/messages" className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 font-medium py-3 px-3 rounded-lg transition-colors">
                  الرسائل
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              )}
            </>
          )}

          {!isSignedIn && (
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100 mt-3">
              <Link href="/register-organization">
                <Button className="w-full rounded-full bg-gray-900 hover:bg-gray-800 text-white h-11">
                  ابدأ كشركة
                </Button>
              </Link>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full rounded-full border-gray-300 h-11">
                  سجل كباحث عن عمل
                </Button>
              </SignUpButton>
            </div>
          )}

          {isSignedIn && (
            <div className="pt-4 border-t border-gray-100 mt-3 px-3">
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
