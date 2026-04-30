import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquare,
  ClipboardList,
  CalendarDays,
  UserCircle2,
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
    name: "الاستبيانات",
    href: "/freelancer/surveys",
    icon: ClipboardList,
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
];

export function isFreelancerNavActive(href, pathname) {
  if (href === "/freelancer") return pathname === "/freelancer";
  return pathname.startsWith(href);
}
