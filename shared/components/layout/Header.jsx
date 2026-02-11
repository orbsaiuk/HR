"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
import { UserButton } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { SubmissionsDropdown } from "@/features/user-submissions";

export function Header() {
  const { isSignedIn, isTeamMember } = useAuth();
  const { unreadCount } = useUnreadCount(isSignedIn && !isTeamMember);

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
          <Link
            href="/team-members"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Team Members
          </Link>

          {isSignedIn && isTeamMember && (
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {isSignedIn && !isTeamMember && (
            <>
              <SubmissionsDropdown />
              <Link
                href="/messages"
                className="relative text-gray-600 hover:text-gray-900 transition-colors p-2"
                aria-label="Messages"
              >
                <MessageSquare size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {isSignedIn && <UserButton />}
        </nav>
      </div>
    </header>
  );
}
