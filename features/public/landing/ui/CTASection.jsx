"use client";

import { CTABanner } from "@/shared/components/sections/CTABanner";

export function CTASection() {
    return (
        <CTABanner
            title="جاهز تبني فريق أقوى؟ أم تبدأ خطوتك المهنية التالية؟"
            description="سواء كنت شركة تبحث عن أفضل الكفاءات، أو محترفًا يسعى لفرص حقيقية تنمّي
                    مسيرته، منصتنا تمنحك الأدوات، السرعة، والثقة لتبدأ اليوم — لا غدًا."
            buttonText="أنشئ حسابك خلال دقائق"
            buttonHref="/sign-up"
        />
    );
}
