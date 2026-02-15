"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Building2, MessageSquare, User } from "lucide-react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { Button } from "@/components/ui/button";

export function Header() {
  const { isSignedIn, isTeamMember, isUser, isUserLoaded } = useAuth();
  const { unreadCount } = useUnreadCount(isSignedIn && isUser);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:text-blue-700"
        >
          FormBuilder
        </Link>

        <nav className="flex items-center gap-6">
          {/* Public links — visible to everyone */}
          <Link
            href="/careers"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Careers
          </Link>

          {/* Register as Organization — visible to signed-in non-team-member users */}
          {isSignedIn && isUserLoaded && isUser && !isTeamMember && (
            <Link
              href="/register-organization"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
            >
              <Building2 size={16} />
              Register Organization
            </Link>
          )}

          {/* Team member links */}
          {isSignedIn && isUserLoaded && isTeamMember && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
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
              <Link
                href="/my-applications"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                My Applications
              </Link>
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
            </>
          )}

          {/* Auth buttons */}
          {!isSignedIn && (
            <>
              <SignInButton mode="modal">
                <Button variant="outline">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </>
          )}

          {isSignedIn && <UserButton />}
        </nav>
      </div>
    </header>
  );
}
