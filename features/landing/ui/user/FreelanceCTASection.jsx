"use client";

import { CTABanner } from "../shared/CTABanner";

export function FreelanceCTASection() {
  return (
    <CTABanner
      title="حين تسعى لمسار مهني أكثر مرونة واستقلالية"
      description="لم يعد التطور المهني مرتبطاً بالوظيفة التقليدية فقط، بل بقدرتك على استثمار مهاراتك بذكاء. من خلال العمل كمستقل يمكنك اختيار مشاريع تناسب خبراتك، إدارة وقتك بكفاءة وبناء سجل مهني قائم على إنجازات حقيقية."
      buttonText="ابدأ كفريلانسر"
      buttonHref="/sign-up"
      bgColor="#F5F5F9"
      titleColor="text-black"
      descriptionColor="text-black"
      buttonColor="text-white bg-black hover:bg-black/80"
    />
  );
}
