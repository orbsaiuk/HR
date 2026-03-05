"use client";

import Image from "next/image";

const HOW_STEPS = [
    {
        number: "01",
        label: "أنشئ حسابك",
        vector: "/images/Home/How/Vector-1.png",
        description:
            "سجّل كشركة أو كباحث عن عمل، وأكمل ملفك خلال دقائق لعرض مهاراتك أو احتياجاتك بوضوح.",
    },
    {
        number: "02",
        label: "انشر أو قدّم",
        vector: "/images/Home/How/Vector-2.png",
        description:
            "الشركات تنشر وظائف أو مشاريع بسهولة، والمواهب تستعرض الفرص المناسبة وتتقدم بخطوات بسيطة وسريعة.",
    },
    {
        number: "03",
        label: "تواصل وابدأ",
        vector: "/images/Home/How/Vector-3.png",
        description:
            "سجّل كشركة أو كباحث عن عمل، وأكمل ملفك خلال دقائق لعرض مهاراتك أو احتياجاتك بوضوح.",
    },
];

export function HowSection() {
    return (
        <section className="py-12 sm:py-16 md:py-20 bg-white" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-14 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4">
                        كيف تعمل المنصة؟
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl">
                        خطوات بسيطة... نتائج أسرع
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8">
                    {HOW_STEPS.map((step) => (
                        <div key={step.number} className="flex flex-col items-center text-center gap-3 sm:gap-4">
                            {/* Number + Label Badge */}
                            <div className="relative inline-flex items-center justify-center mb-1 sm:mb-2">
                                <Image
                                    src={step.vector}
                                    alt=""
                                    aria-hidden="true"
                                    width={200}
                                    height={56}
                                    className="w-36 sm:w-40 md:w-44 h-auto"
                                />
                                <div className="absolute inset-0 flex items-center justify-center gap-2 px-3 text-base sm:text-xl">
                                    <span className="text-white font-extrabold leading-none">{step.number}</span>
                                    <span className="text-white font-bold leading-none">{step.label}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-sm sm:text-base md:text-lg leading-relaxed max-w-xs px-2">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
