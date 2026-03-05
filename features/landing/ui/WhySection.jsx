"use client";

import Image from "next/image";
import { Clock3, ShieldCheck, Layers, BarChart3 } from "lucide-react";

const WHY_FEATURES = [
    {
        icon: Clock3,
        title: "تجربة منظمة تختصر الوقت وتقلل العشوائية",
    },
    {
        icon: ShieldCheck,
        title: "أدوات تقييم تساعد على اختيار الأنسب بثقة",
    },
    {
        icon: Layers,
        title: "مرونة في التوظيف (دوام كامل أو مشاريع)",
    },
    {
        icon: BarChart3,
        title: "تقارير واضحة تدعم قرارات مبنية على بيانات",
    },
];

export function WhySection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-10 sm:mb-14 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center">
                        لماذا نحن الخيار الأذكى للتوظيف؟
                    </h2>
                    <Image
                        src="/images/Home/About/arrow.png"
                        alt=""
                        aria-hidden="true"
                        width={80}
                        height={80}
                        className="w-14 sm:w-16 md:w-20 h-auto mt-2 sm:mt-4 hidden sm:block"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-x-12 md:gap-x-16 sm:gap-y-10 md:gap-y-12 max-w-4xl mx-auto">
                    {WHY_FEATURES.map((feature) => (
                        <div key={feature.title} className="flex flex-col items-center text-center gap-3 sm:gap-4">
                            <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#5286A5]" strokeWidth={1.2} />
                            <p className="text-base sm:text-lg md:text-xl text-black font-medium leading-relaxed max-w-[280px] sm:max-w-none">
                                {feature.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
