import { FreelancerPagePlaceholder } from "@/features/freelancer-dashboard";

export const metadata = {
  title: "الرسائل | لوحة المستقل",
  description: "متابعة محادثات ورسائل العملاء",
};

export default function Page() {
  return (
    <FreelancerPagePlaceholder
      title="الرسائل"
      description="تحكم بمحادثاتك مع العملاء وابقَ على اطلاع دائم بكل الرسائل الجديدة."
    />
  );
}
