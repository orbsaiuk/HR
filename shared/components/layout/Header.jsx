"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useHeaderState } from "./header/useHeaderState";
import { DesktopNav } from "./header/DesktopNav";
import { MobileNav } from "./header/MobileNav";

export function Header() {
  const state = useHeaderState();

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-gray-700 order-last"
        >
          <span className="font-heading">HireHub</span>
        </Link>

        {/* Desktop */}
        <DesktopNav
          isSignedIn={state.isSignedIn}
          isUser={state.isUser}
          isUserLoaded={state.isUserLoaded}
          isTeamMember={state.isTeamMember}
          isNavReady={state.isNavReady}
          unreadCount={state.unreadCount}
          showOrgLink={state.showOrgLink}
          hasPendingRequest={state.hasPendingRequest}
          hasApprovedRequest={state.hasApprovedRequest}
          hasOrgRequest={state.hasOrgRequest}
          navigateToDashboard={state.navigateToDashboard}
        />

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-gray-700 order-first rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => state.setMobileMenuOpen(!state.mobileMenuOpen)}
          aria-label="القائمة"
          aria-expanded={state.mobileMenuOpen}
        >
          {state.mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile */}
      <MobileNav
        isOpen={state.mobileMenuOpen}
        onClose={() => state.setMobileMenuOpen(false)}
        isSignedIn={state.isSignedIn}
        isUser={state.isUser}
        isUserLoaded={state.isUserLoaded}
        isTeamMember={state.isTeamMember}
        unreadCount={state.unreadCount}
        hasOrgRequest={state.hasOrgRequest}
        hasPendingRequest={state.hasPendingRequest}
        hasApprovedRequest={state.hasApprovedRequest}
        navigateToDashboard={state.navigateToDashboard}
      />
    </header>
  );
}
