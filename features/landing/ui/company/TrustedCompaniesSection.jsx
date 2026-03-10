"use client";

import { ArrowLeft } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const COMPANIES = [
    {
        id: 1,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/google.svg",
    },
    {
        id: 2,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoft.svg",
    },
    {
        id: 3,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazon.svg",
    },
    {
        id: 4,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg",
    },
    {
        id: 5,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/meta.svg",
    },
    {
        id: 6,
        name: "اسم الشركة",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/netflix.svg",
    },
];

function CompanyLogoCard({ company }) {
    return (
        <div className="flex flex-col items-center gap-2 sm:gap-3 group cursor-pointer">
            {/* Logo Square */}
            <div className="w-full aspect-square overflow-hidden rounded-sm bg-gray-50 border border-gray-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
                <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain opacity-70"
                />
            </div>
            {/* Company Name with Arrow */}
            <div className="flex items-center justify-between gap-1 sm:gap-1.5 text-gray-600 w-full">
                <span className="text-[10px] sm:text-xs md:text-base font-medium underline truncate">
                    {company.name}
                </span>
                <ArrowLeft size={16} className="text-red-700 shrink-0 sm:w-5 sm:h-5" />
            </div>
        </div>
    );
}

export function TrustedCompaniesSection() {
    return (
        <section className="bg-white py-8 sm:py-12">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Title */}
                <div className="text-center mb-6 sm:mb-10 md:mb-14">
                    <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight">
                        شركات تثق بمنصتنا
                    </h2>
                </div>

                {/* Mobile/Tablet Carousel with Autoplay */}
                <div className="block md:hidden">
                    <Carousel
                        opts={{
                            align: "start",
                            direction: "rtl",
                            loop: true,
                            slidesToScroll: 1,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 2500,
                                stopOnInteraction: false,
                                stopOnMouseEnter: true,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-mr-3 ml-0">
                            {COMPANIES.map((company) => (
                                <CarouselItem
                                    key={company.id}
                                    className="pr-3 pl-0 basis-1/3 sm:basis-1/4"
                                >
                                    <CompanyLogoCard company={company} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselDots className="mt-6" />
                    </Carousel>
                </div>

                {/* Desktop Grid with Autoplay Carousel */}
                <div className="hidden md:block">
                    <Carousel
                        opts={{
                            align: "start",
                            direction: "rtl",
                            loop: true,
                            slidesToScroll: 1,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                                stopOnInteraction: false,
                                stopOnMouseEnter: true,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-mr-4 ml-0">
                            {COMPANIES.map((company) => (
                                <CarouselItem
                                    key={company.id}
                                    className="pr-4 pl-0 md:basis-1/4 lg:basis-1/6"
                                >
                                    <CompanyLogoCard company={company} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselDots className="mt-8" />
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
