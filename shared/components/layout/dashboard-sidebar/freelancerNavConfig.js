import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  Wallet,
  CalendarDays,
  UserCircle2,
  Settings,
  Send,
} from "lucide-react";

export const FREELANCER_NAV_ITEMS = [
  {
    name: "نظرة عامة",
    href: "/freelancer",
    icon: LayoutDashboard,
  },
  {
    name: "مشاريعي",
    href: "/freelancer/projects",
    icon: Briefcase,
  },
  {
    name: "العروض المقدمة",
    href: "/freelancer/proposals",
    icon: Send,
  },
  {
    name: "العقود",
    href: "/freelancer/contracts",
    icon: FileText,
  },
  {
    name: "الرسائل",
    href: "/freelancer/messages",
    icon: MessageSquare,
  },
  {
    name: "الأرباح",
    href: "/freelancer/earnings",
    icon: Wallet,
  },
  {
    name: "التقويم",
    href: "/freelancer/calendar",
    icon: CalendarDays,
  },
  {
    name: "الملف الشخصي",
    href: "/freelancer/profile",
    icon: UserCircle2,
  },
  {
    name: "الإعدادات",
    href: "/freelancer/settings",
    icon: Settings,
  },
];

export function isFreelancerNavActive(href, pathname) {
  if (href === "/freelancer") return pathname === "/freelancer";
  return pathname.startsWith(href);
}
