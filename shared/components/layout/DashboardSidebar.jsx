"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUnreadCount } from "@/features/shared/messaging/model/useUnreadCount";
import { usePermissions } from "@/features/company/org-members";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { useCurrentOrg } from "@/shared/hooks/useCurrentOrg";
import { urlFor } from "@/shared/lib/sanityImage";
import { NAV_ITEMS } from "./dashboard-sidebar/navConfig";
import { FREELANCER_NAV_ITEMS } from "./dashboard-sidebar/freelancerNavConfig";
import { SidebarDesktop, SidebarMobileDrawer } from "./dashboard-sidebar";

export function DashboardSidebar({
  isMobileOpen,
  onClose,
  variant = "company",
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  const isFreelancer = variant === "freelancer";
  const canViewMessages =
    isFreelancer ||
    (!permissionsLoading && hasPermission(PERMISSIONS.VIEW_MESSAGES));
  const { unreadCount } = useUnreadCount(canViewMessages);
  const { org } = useCurrentOrg();

  const logoUrl = org?.logo
    ? urlFor(org.logo).width(64).height(64).url()
    : null;

  const navItems = isFreelancer
    ? FREELANCER_NAV_ITEMS
    : permissionsLoading
      ? []
      : NAV_ITEMS.filter(
          (item) => !item.permission || hasPermission(item.permission),
        );

  const profileName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "المستخدم";

  const sidebarProps = {
    logoUrl: isFreelancer ? user?.imageUrl : logoUrl,
    orgName: isFreelancer ? profileName : org?.name,
    navItems,
    pathname,
    unreadCount,
    permissionsLoading: isFreelancer ? false : permissionsLoading,
    skeletonCount: isFreelancer
      ? FREELANCER_NAV_ITEMS.length
      : NAV_ITEMS.length,
    homeHref: isFreelancer ? "/freelancer" : "/company",
    variant,
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
