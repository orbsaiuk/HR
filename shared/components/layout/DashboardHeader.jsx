"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { usePermissions } from "@/features/team-member-management";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { useCurrentOrg } from "@/shared/hooks/useCurrentOrg";
import { urlFor } from "@/shared/lib/sanityImage";
import { NAV_ITEMS } from "./dashboard-header/navConfig";
import { DashboardDesktopNav } from "./dashboard-header/DashboardDesktopNav";
import { DashboardMobileNav } from "./dashboard-header/DashboardMobileNav";
import { DashboardHeaderActions } from "./dashboard-header/DashboardHeaderActions";

export function DashboardHeader() {
  const { unreadCount } = useUnreadCount();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const { org } = useCurrentOrg();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logoUrl = org?.logo
    ? urlFor(org.logo).width(64).height(64).url()
    : null;

  const navItems = permissionsLoading
    ? []
    : NAV_ITEMS.filter(
      (item) => !item.permission || hasPermission(item.permission),
    );

  const canCreatePosition =
    !permissionsLoading && hasPermission(PERMISSIONS.MANAGE_POSITIONS);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Logo + Nav (end side in RTL) */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={org?.name || "المنظمة"}
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
              {org?.name || "لوحة التحكم"}
            </span>
          </Link>

          <DashboardDesktopNav
            navItems={navItems}
            pathname={pathname}
            unreadCount={unreadCount}
            permissionsLoading={permissionsLoading}
          />
        </div>

        {/* Actions (start side in RTL) */}
        <DashboardHeaderActions
          canCreatePosition={canCreatePosition}
          permissionsLoading={permissionsLoading}
          isMobileOpen={isMobileOpen}
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
        />
      </div>

      {/* Mobile nav dropdown */}
      <DashboardMobileNav
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={navItems}
        pathname={pathname}
        unreadCount={unreadCount}
        permissionsLoading={permissionsLoading}
      />
    </header>
  );
}
