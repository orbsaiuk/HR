import {
  LayoutDashboard,
  Briefcase,
  ClipboardList,
  MessageSquare,
  Users,
  Settings,
  CalendarDays,
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
    name: "المشاريع",
    href: "/company/projects",
    icon: Briefcase,
    permission: null,
  },
  {
    name: "النماذج",
    href: "/company/forms",
    icon: ClipboardList,
    permission: PERMISSIONS.VIEW_FORMS,
  },
  {
    name: "التقويم",
    href: "/company/calendar",
    icon: CalendarDays,
    permission: null,
  },
  {
    name: "الرسائل",
    href: "/company/messages",
    icon: MessageSquare,
    permission: PERMISSIONS.VIEW_MESSAGES,
  },
  {
    name: "أعضاء الشركة",
    href: "/company/org-members",
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
