import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "مشاريعي | لوحة المستقل",
  description: "إدارة المشاريع الخاصة بالمستقل",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="مشاريعي"
      description="استعرض جميع المشاريع التي تعمل عليها حالياً وتابع حالة التنفيذ والتسليم."
    />
  );
}
