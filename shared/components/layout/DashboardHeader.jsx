"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  Menu,
  X,
  Users,
  Briefcase,
  Building2,
  Home,
} from "lucide-react";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { useIsOwner } from "@/features/team-member-management";
import { useCurrentOrg } from "@/shared/hooks/useCurrentOrg";
import { urlFor } from "@/shared/lib/sanityImage";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { unreadCount } = useUnreadCount();
  const { isOwner } = useIsOwner();
  const { org } = useCurrentOrg();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logoUrl = org?.logo ? urlFor(org.logo).width(64).height(64).url() : null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Positions", href: "/dashboard/positions", icon: Briefcase },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    ...(isOwner
      ? [{ name: "Team Members", href: "/dashboard/team-members", icon: Users }]
      : []),
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={org?.name || "Organization"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-lg object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="text-white" size={18} />
              </div>
            )}
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              {org?.name || "Dashboard"}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showBadge = item.name === "Messages" && unreadCount > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                    ${active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                  {showBadge && (
                    <span className="ml-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Home + New Position + User */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-md hover:bg-gray-100"
            title="Go to Home"
          >
            <Home size={18} />
          </Link>
          <Button size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/dashboard/positions/create">
              <Plus size={16} className="mr-1.5" />
              New Position
            </Link>
          </Button>
          <Button size="icon" variant="ghost" asChild className="sm:hidden">
            <Link href="/dashboard/positions/create">
              <Plus size={18} />
            </Link>
          </Button>
          <UserButton />

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {isMobileOpen && (
        <nav className="lg:hidden border-t border-gray-100 bg-white px-4 pb-3 pt-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const showBadge = item.name === "Messages" && unreadCount > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
                {showBadge && (
                  <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full min-w-5 h-5 flex items-center justify-center px-1.5">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
