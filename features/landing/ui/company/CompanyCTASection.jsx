"use client";

import { CTABanner } from "../../../../shared/components/sections/CTABanner";

export function CompanyCTASection() {
    return (
        <CTABanner
            title="ابدأ في جذب أفضل المواهب الآن"
            description="منصتنا توفر لك الأدوات والتقنيات اللازمة لاستقطاب أفضل الكفاءات
                    وبناء فريق عمل متميز يحقق أهداف شركتك."
            buttonText="ابدأ الآن"
            buttonHref="/dashboard"
        />
    );
}
