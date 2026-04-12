"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUnreadCount } from "@/features/chat/model/useUnreadCount";
import { usePermissions } from "@/features/org-members-management";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { useCurrentOrg } from "@/shared/hooks/useCurrentOrg";
import { urlFor } from "@/shared/lib/sanityImage";
import { NAV_ITEMS } from "./dashboard-sidebar/navConfig";
import { SidebarDesktop, SidebarMobileDrawer } from "./dashboard-sidebar";

export function DashboardSidebar({ isMobileOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const canViewMessages =
    !permissionsLoading && hasPermission(PERMISSIONS.VIEW_MESSAGES);
  const { unreadCount } = useUnreadCount(canViewMessages);
  const { org } = useCurrentOrg();

  const logoUrl = org?.logo
    ? urlFor(org.logo).width(64).height(64).url()
    : null;

  const navItems = permissionsLoading
    ? []
    : NAV_ITEMS.filter(
        (item) => !item.permission || hasPermission(item.permission),
      );

  const sidebarProps = {
    logoUrl,
    orgName: org?.name,
    navItems,
    pathname,
    unreadCount,
    permissionsLoading,
  };

  return (
    <>
      <SidebarDesktop
        {...sidebarProps}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      <SidebarMobileDrawer
        {...sidebarProps}
        isOpen={isMobileOpen}
        onClose={onClose}
      />
    </>
  );
}
