"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const FREELANCERS = [
    {
        id: 1,
        name: "أحمد محمد",
        title: "مطور Full Stack",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        hourlyRate: 45,
        projects: 60,
    },
    {
        id: 2,
        name: "سارة أحمد",
        title: "مصممة UI/UX",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        hourlyRate: 40,
        projects: 48,
    },
    {
        id: 3,
        name: "محمد علي",
        title: "مطور Full Stack",
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        rating: 5,
        hourlyRate: 50,
        projects: 72,
    },
    {
        id: 4,
        name: "نورة خالد",
        title: "كاتبة محتوى",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        rating: 5,
        hourlyRate: 30,
        projects: 55,
    },
    {
        id: 5,
        name: "عمر حسن",
        title: "محلل بيانات",
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        rating: 5,
        hourlyRate: 55,
        projects: 40,
    },
    {
        id: 6,
        name: "ليلى عبدالله",
        title: "مديرة تسويق رقمي",
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        rating: 5,
        hourlyRate: 42,
        projects: 38,
    },
];

function getInitials(name) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);
}

export function TopFreelancersSection() {
    return (
        <section className="py-8 sm:py-12">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-3 sm:mb-4 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight text-[#5286A5]">
                        أفضل فريلانسرز
                    </h2>
                </div>
                <div className="max-w-3xl mb-6 sm:mb-8 md:mb-12">
                    <p className="text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed">
                        سواء كنت تبحث عن موظف دائم أو مستقل، نوفر لك الحل المناسب
                    </p>
                </div>

                {/* Carousel */}
                <Carousel
                    opts={{
                        align: "start",
                        direction: "rtl",
                        loop: true,
                        slidesToScroll: 1,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-mr-4 ml-0">
                        {FREELANCERS.map((freelancer) => (
                            <CarouselItem
                                key={freelancer.id}
                                className="pr-4 pl-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                            >
                                <FreelancerCard freelancer={freelancer} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselDots className="mt-8 sm:mt-12" />
                </Carousel>
            </div>
        </section>
    );
}

function FreelancerCard({ freelancer }) {
    return (
        <Card className="h-full overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl">
            {/* Colorful Banner */}
            <div className="relative h-24 sm:h-28 overflow-hidden rounded-t-xl">
                <Image
                    src="/images/Home/Freelance/bg.png"
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
            </div>

            {/* Avatar overlapping banner */}
            <div className="flex justify-between items-end -mt-8 sm:-mt-10 relative z-10 px-3">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 border-4 border-white shadow-md">
                    <AvatarImage
                        src={freelancer.image}
                        alt={freelancer.name}
                    />
                    <AvatarFallback className="text-base sm:text-lg font-bold bg-[#2D8C5E]/10 text-[#2D8C5E]">
                        {getInitials(freelancer.name)}
                    </AvatarFallback>
                </Avatar>
                {/* Stars on banner */}
                <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: freelancer.rating }).map((_, i) => (
                        <Star
                            key={i}
                            className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
                        />
                    ))}
                </div>
            </div>

            <CardContent className="pt-2 sm:pt-3 pb-4 sm:pb-5 px-3">
                {/* Name and title */}
                <h3 className="font-bold text-sm sm:text-base md:text-lg truncate">
                    {freelancer.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate mb-3 sm:mb-4">
                    {freelancer.title}
                </p>

                <hr />

                {/* Stats row */}
                <div className="flex items-center justify-between my-3 sm:my-5 px-1 sm:px-2 text-red-700">
                    <span className="text-xs sm:text-sm font-medium">
                        {freelancer.projects} مشروع
                    </span>
                    <span className="text-xs sm:text-sm font-medium">
                        ${freelancer.hourlyRate}/ساعة
                    </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2 sm:gap-3">
                    <Button
                        size="sm"
                        className="flex-1 h-8 sm:h-9 rounded-lg bg-[#5286A5] hover:bg-[#5286A5]/90 text-white text-xs sm:text-sm"
                    >
                        عرض الملف
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8 sm:h-9 rounded-lg border-[#5286A5] text-[#5286A5] text-xs sm:text-sm"
                    >
                        دعوة للتقديم
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

