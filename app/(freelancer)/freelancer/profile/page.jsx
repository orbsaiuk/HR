import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "الملف الشخصي | لوحة المستقل",
  description: "إدارة الملف الشخصي للمستقل",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="الملف الشخصي"
      description="حدّث بياناتك المهنية ومهاراتك وروابط أعمالك لزيادة فرصك في الحصول على مشاريع."
    />
  );
}
