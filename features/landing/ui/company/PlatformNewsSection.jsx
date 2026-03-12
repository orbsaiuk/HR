"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "@/components/ui/carousel";

const ARTICLES = [
    {
        id: 1,
        title: "كيف تبني بروفايل احترافي يجذب العملاء؟",
        description:
            "تعرّف على أهم العناصر التي تجعل بروفايلك أكثر احترافية وجاذبية للعملاء.",
        image: "/images/Home/Hero/company-1.png",
        date: "24 Oct, 2021",
        slug: "#",
    },
    {
        id: 2,
        title: "كيف تبني بروفايل احترافي يجذب العملاء؟",
        description:
            "تعرّف على أهم العناصر التي تجعل بروفايلك أكثر احترافية وجاذبية للعملاء.",
        image: "/images/Home/Hero/company-2.png",
        date: "24 Oct, 2021",
        slug: "#",
    },
    {
        id: 3,
        title: "كيف تبني بروفايل احترافي يجذب العملاء؟",
        description:
            "تعرّف على أهم العناصر التي تجعل بروفايلك أكثر احترافية وجاذبية للعملاء.",
        image: "/images/Home/Hero/company-1.png",
        date: "24 Oct, 2021",
        slug: "#",
    },
    {
        id: 4,
        title: "كيف تبني بروفايل احترافي يجذب العملاء؟",
        description:
            "تعرّف على أهم العناصر التي تجعل بروفايلك أكثر احترافية وجاذبية للعملاء.",
        image: "/images/Home/Hero/company-2.png",
        date: "24 Oct, 2021",
        slug: "#",
    },
    {
        id: 5,
        title: "كيف تبني بروفايل احترافي يجذب العملاء؟",
        description:
            "تعرّف على أهم العناصر التي تجعل بروفايلك أكثر احترافية وجاذبية للعملاء.",
        image: "/images/Home/Hero/company-1.png",
        date: "24 Oct, 2021",
        slug: "#",
    },
];

export function PlatformNewsSection() {
    return (
        <section className="py-8 sm:py-12" dir="rtl">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-right mb-2 sm:mb-3 md:mb-4">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight">
                        أخبار المنصة
                    </h2>
                </div>
                <div className="text-right max-w-3xl me-0 mb-6 sm:mb-8 md:mb-12">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                        تابع آخر التحديثات والمقالات والنصائح الخاصة بالفريلانسرز والشركات
                    </p>
                </div>

                {/* Articles Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        direction: "rtl",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-mr-4 ml-0">
                        {ARTICLES.map((article) => (
                            <CarouselItem
                                key={article.id}
                                className="pr-4 pl-0 basis-full sm:basis-1/2 lg:basis-1/3"
                            >
                                <ArticleCard article={article} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselDots />
                </Carousel>
            </div>
        </section>
    );
}

function ArticleCard({ article }) {
    return (
        <Card className="group overflow-hidden border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
            {/* Image */}
            <div className="relative w-full h-40 sm:h-48 md:h-52 overflow-hidden">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>

            {/* Content */}
            <CardContent className="p-4 sm:p-5 md:p-6 pb-2">
                {/* Title */}
                <h3 className="text-sm sm:text-base md:text-lg mb-1.5 sm:mb-2 line-clamp-2">
                    {article.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.description}
                </p>
            </CardContent>

            {/* Footer */}
            <CardFooter className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 pt-2 sm:pt-3 flex items-center justify-between gap-2">
                <Link
                    href={article.slug}
                    className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#5286A5] shrink-0"
                >
                    اقرأ المزيد
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                    <span className="text-[10px] sm:text-xs md:text-sm whitespace-nowrap">{article.date}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
