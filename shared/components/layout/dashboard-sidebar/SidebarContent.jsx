"use client";

import Link from "next/link";
import Image from "next/image";
import { UserButton, useUser } from "@clerk/nextjs";
import { Building2, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isNavActive } from "./navConfig";

export function SidebarContent({
  logoUrl,
  orgName,
  navItems,
  pathname,
  unreadCount,
  permissionsLoading,
  isCollapsed = false,
  showCollapseToggle = false,
  onToggleCollapse,
  onNavigate,
}) {
  const { user } = useUser();
  const CollapseIcon = isCollapsed ? ChevronLeft : ChevronRight;
  const userName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "المستخدم";

  return (
    <>
      <div
        className={cn(
          "border-b border-slate-100",
          isCollapsed ? "px-2 py-3" : "px-5 py-4",
        )}
      >
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "justify-between gap-3",
          )}
        >
          <Link
            href="/company"
            onClick={onNavigate}
            title={isCollapsed ? orgName || "اسم الشركة" : undefined}
            className={cn(
              "flex items-center",
              isCollapsed ? "justify-center" : "gap-3",
            )}
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={orgName || "المنظمة"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Building2 size={18} />
              </div>
            )}

            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {orgName || "اسم الشركة"}
                </p>
              </div>
            )}
          </Link>

          {showCollapseToggle && !isCollapsed && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label="طي القائمة"
              className="h-8 w-8 rounded-lg border border-slate-200"
            >
              <CollapseIcon size={16} />
            </Button>
          )}
        </div>

        {showCollapseToggle && isCollapsed && (
          <div className="mt-3 flex justify-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              aria-label="توسيع القائمة"
              className="h-8 w-8 rounded-lg border border-slate-200"
            >
              <CollapseIcon size={16} />
            </Button>
          </div>
        )}
      </div>

      <nav
        className={cn(
          "flex-1 space-y-1 overflow-y-auto py-4",
          isCollapsed ? "px-2" : "px-3",
        )}
      >
        {permissionsLoading ? (
          <SidebarSkeleton isCollapsed={isCollapsed} />
        ) : (
          navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.href, pathname);
            const showBadge =
              item.name === "الرسائل" && unreadCount > 0 && !isCollapsed;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                title={isCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                )}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.name}</span>}
                {showBadge && (
                  <span className="ms-auto flex min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      <div
        className={cn("border-t border-slate-100 p-3", isCollapsed && "px-2")}
      >
        <Link
          href="/"
          onClick={onNavigate}
          title={isCollapsed ? "العودة للموقع" : undefined}
          className={cn(
            "flex rounded-xl py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
            isCollapsed ? "justify-center px-0" : "items-center gap-3 px-3",
          )}
        >
          <Home size={18} />
          {!isCollapsed && <span>العودة للموقع</span>}
        </Link>

        <div
          className={cn(
            "mt-2 rounded-xl border border-slate-200 bg-white",
            isCollapsed
              ? "flex justify-center py-2"
              : "flex items-center gap-3 px-3 py-2",
          )}
          title={isCollapsed ? userName : undefined}
        >
          <UserButton />
          {!isCollapsed && (
            <span className="truncate text-sm font-medium text-slate-700">
              {userName}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

function SidebarSkeleton({ isCollapsed = false }) {
  return Array.from({ length: NAV_ITEMS.length }, (_, index) => (
    <Skeleton
      key={index}
      className={cn("h-10 rounded-xl", isCollapsed ? "w-10 mx-auto" : "w-full")}
    />
  ));
}
