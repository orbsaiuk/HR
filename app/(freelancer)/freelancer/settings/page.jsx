import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "الإعدادات | لوحة المستقل",
  description: "إعدادات حساب المستقل",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="الإعدادات"
      description="اضبط إعدادات حسابك، تفضيلات الإشعارات، وطرق التواصل بما يناسب طريقة عملك."
    />
  );
}
