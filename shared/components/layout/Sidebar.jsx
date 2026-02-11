"use client";

import Link from "next/link";
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
} from "lucide-react";
import { useState } from "react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { useIsOwner } from "@/features/team-member-management";

export function Sidebar({ stats }) {
  const { unreadCount } = useUnreadCount();
  const { isOwner } = useIsOwner();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Positions",
      href: "/dashboard/positions",
      icon: Briefcase,
    },
    {
      name: "Messages",
      href: "/dashboard/messages",
      icon: MessageSquare,
    },
    ...(isOwner
      ? [
          {
            name: "Team Members",
            href: "/dashboard/team-members",
            icon: Users,
          },
        ]
      : []),
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                    fixed lg:sticky top-0 left-0 z-40 h-screen
                    bg-white border-r border-gray-200
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? "w-20" : "w-64"}
                    ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="text-white" size={18} />
              </div>
              {!isCollapsed && (
                <span className="font-bold text-xl text-gray-900">
                  FormBuilder
                </span>
              )}
            </Link>
          </div>

          {/* Quick Stats */}
          {!isCollapsed && stats && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Positions</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {stats.totalPositions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Open</span>
                  <span className="text-sm font-semibold text-green-600">
                    {stats.openPositions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Applications</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {stats.totalApplications || 0}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const showBadge = item.name === "Messages" && unreadCount > 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-lg
                                                transition-colors duration-200 relative
                                                ${
                                                  isActive(item.href)
                                                    ? "bg-blue-50 text-blue-600"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                }
                                            `}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <Icon size={20} />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium">{item.name}</span>
                          {showBadge && (
                            <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </>
                      )}
                      {isCollapsed && showBadge && (
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Create Position Button */}
          <div className="p-4 border-t border-gray-200">
            <Link
              href="/dashboard/positions/create"
              className={`
                                flex items-center justify-center gap-2
                                w-full px-4 py-2.5 rounded-lg
                                bg-blue-600 text-white font-medium
                                hover:bg-blue-700 transition-colors
                                ${isCollapsed ? "px-2" : ""}
                            `}
              onClick={() => setIsMobileOpen(false)}
            >
              <Plus size={20} />
              {!isCollapsed && <span>New Position</span>}
            </Link>
          </div>

          {/* Collapse Toggle */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <Menu size={20} />
              ) : (
                <>
                  <span className="text-sm">Collapse</span>
                  <Menu size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
