"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section
            className="py-14 sm:py-18 md:py-24 px-4 sm:px-6"
            style={{ backgroundColor: "#5286A5" }}
            dir="rtl"
        >
            <div className="container mx-auto max-w-3xl text-center text-white">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug mb-4 sm:mb-6">
                    جاهز تبني فريق أقوى؟ أم تبدأ خطوتك المهنية التالية؟
                </h2>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                    سواء كنت شركة تبحث عن أفضل الكفاءات، أو محترفًا يسعى لفرص حقيقية تنمّي
                    مسيرته، منصتنا تمنحك الأدوات، السرعة، والثقة لتبدأ اليوم — لا غدًا.
                </p>
                <Button
                    asChild
                    className="h-11 sm:h-12 px-8 sm:px-10 rounded-lg bg-white text-black hover:bg-gray-100 font-semibold text-sm sm:text-base"
                >
                    <Link href="/sign-up">أنشئ حسابك خلال دقائق</Link>
                </Button>
            </div>
        </section>
    );
}
