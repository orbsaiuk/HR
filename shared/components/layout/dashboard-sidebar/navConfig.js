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
    href: "/company",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    name: "الوظائف",
    href: "/company/positions",
    icon: Briefcase,
    permission: PERMISSIONS.VIEW_POSITIONS,
  },
  {
    name: "النماذج",
    href: "/company/forms",
    icon: ClipboardList,
    permission: PERMISSIONS.VIEW_FORMS,
  },
  {
    name: "الرسائل",
    href: "/company/messages",
    icon: MessageSquare,
    permission: PERMISSIONS.VIEW_MESSAGES,
  },
  {
    name: "أعضاء الفريق",
    href: "/company/team-members",
    icon: Users,
    permission: PERMISSIONS.MANAGE_TEAM,
  },
  {
    name: "الإعدادات",
    href: "/company/settings",
    icon: Settings,
    permission: PERMISSIONS.MANAGE_SETTINGS,
  },
];

/**
 * Returns true when `pathname` matches the given nav `href`.
 */
export function isNavActive(href, pathname) {
  if (href === "/company") return pathname === "/company";
  return pathname.startsWith(href);
}
