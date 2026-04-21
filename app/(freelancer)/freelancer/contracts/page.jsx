import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "العقود | لوحة المستقل",
  description: "عرض وإدارة عقود المستقل",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="العقود"
      description="راجع العقود النشطة والمنتهية وتابع تفاصيل الالتزامات والجداول الزمنية."
    />
  );
}
