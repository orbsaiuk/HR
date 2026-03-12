"use client";

import { CTABanner } from "../shared/CTABanner";

export function UserCTASection() {
  return (
    <CTABanner
      title="لا تؤجل خطوتك القادمة"
      description="أنشئ حسابك اليوم وابدأ التقديم على الوظائف التي تناسب مهاراتك وطموحاتك"
      buttonText="ابدأ الآن"
      buttonHref="/careers"
    />
  );
}
