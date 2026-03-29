import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  MessageSquare,
  Users,
  Settings,
} from "lucide-react";
import { PERMISSIONS } from "@/shared/lib/permissions";

/**
 * Dashboard navigation items — Arabic labels, RTL-ready.
 */
export const NAV_ITEMS = [
  {
    name: "نظرة عامة",
    href: "/dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    name: "الوظائف",
    href: "/dashboard/positions",
    icon: Briefcase,
    permission: PERMISSIONS.VIEW_POSITIONS,
  },
  {
    name: "النماذج",
    href: "/dashboard/forms",
    icon: ClipboardList,
    permission: PERMISSIONS.VIEW_FORMS,
  },
  {
    name: "الرسائل",
    href: "/dashboard/messages",
    icon: MessageSquare,
    permission: PERMISSIONS.VIEW_MESSAGES,
  },
  {
    name: "أعضاء الفريق",
    href: "/dashboard/team-members",
    icon: Users,
    permission: PERMISSIONS.MANAGE_TEAM,
  },
  {
    name: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
    permission: PERMISSIONS.MANAGE_SETTINGS,
  },
];

/**
 * Returns true when `pathname` matches the given nav `href`.
 */
export function isNavActive(href, pathname) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
}
