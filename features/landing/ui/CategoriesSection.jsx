import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CATEGORIES = [
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "البرمجة",
    },
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "ماركيتنج",
        useAlt: true,
    },
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "البرمجة",
    },
    {
        icon: "/images/Home/Categories/category-1.png",
        label: "التصميم",
    },
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "البرمجة",
    },
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "ماركيتنج",
        useAlt: true,
    },
    {
        icon: "/images/Home/Categories/category-2.png",
        label: "البرمجة",
    },
    {
        icon: "/images/Home/Categories/category-1.png",
        label: "التصميم",
    },
];

export function CategoriesSection() {
    return (
        <section className="relative bg-[#F8F8F8] py-12 sm:py-16 md:py-24" dir="rtl">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
                        <span className="text-[#2D8C5E]">فرص حقيقية</span>
                        <span className="text-black">... ونمو مهني مستمر</span>
                    </h2>
                </div>

                {/* Description */}
                <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
                    <p className="text-sm sm:text-base md:text-xl leading-relaxed px-2">
                        استعرض مئات الوظائف المتنوعة في مختلف المجالات، واختر الفرصة التي
                        تناسب خبراتك وطموحاتك المهنية.
                        نوفّر لك بيئة احترافية تتيح لك التقديم بسهولة، متابعة حالة طلبك
                        بشفافية، والتواصل مع شركات جادة تبحث عن كفاءات حقيقية.
                    </p>
                </div>

                {/* Browse Jobs Button */}
                <div className="flex justify-center mb-8 sm:mb-12">
                    <Button
                        asChild
                        className="h-11 sm:h-12 px-8 sm:px-10 rounded-lg bg-black hover:bg-black/90 text-white font-medium text-sm sm:text-base"
                    >
                        <Link href="/careers">تصفح الوظائف</Link>
                    </Button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                    {CATEGORIES.map((category, index) => (
                        <Link
                            key={index}
                            href="/careers"
                            className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer transition-transform hover:scale-105"
                        >
                            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                                <Image
                                    src={category.icon}
                                    alt={category.label}
                                    width={64}
                                    height={64}
                                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                                />
                            </div>
                            <span className="text-sm sm:text-base md:text-lg font-bold text-black group-hover:text-[#2D8C5E] transition-colors">
                                {category.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
