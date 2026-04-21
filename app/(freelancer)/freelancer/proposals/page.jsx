import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "العروض المقدمة | لوحة المستقل",
  description: "متابعة العروض المرسلة إلى المشاريع",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="العروض المقدمة"
      description="تابع عروضك المرسلة للعملاء وحالات القبول أو الرفض من مكان واحد."
    />
  );
}
