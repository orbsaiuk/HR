import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "الأرباح | لوحة المستقل",
  description: "تحليل وتتبع أرباح المستقل",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="الأرباح"
      description="تابع ملخص الدخل والمدفوعات والأرباح الشهرية مع مؤشرات الأداء المالية."
    />
  );
}
