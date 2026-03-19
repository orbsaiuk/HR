"use client";

import { CTABanner } from "../../../../shared/components/sections/CTABanner";

export function BusinessCTASection() {
    return (
        <CTABanner
            title="حوّل خطتك إلى إنجاز حقيقي"
            description="انطلق معنا نحو تأسيس أقوى، توظيف أذكى، وفريق أكثر إنتاجية."
            buttonText="ابدأ الآن"
            buttonHref="/careers"
            buttonColor="text-white hover:bg-black/70"
        />
    );
}
