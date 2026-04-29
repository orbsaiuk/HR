import { CalendarDashboard } from "@/features/company/calendar";

export const metadata = {
  title: "التقويم | لوحة تحكم الشركة",
  description: "عرض التقويم والمواعيد الخاصة بالشركة",
};

export default function CalendarPage() {
  return <CalendarDashboard />;
}
