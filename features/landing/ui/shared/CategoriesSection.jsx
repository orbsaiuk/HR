"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselDots,
} from "@/components/ui/carousel";

function CategoryCard({ category }) {
    return (
        <Link
            href="/careers"
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl aspect-[3/2] sm:aspect-[2/1] cursor-pointer hover:scale-[1.02] transition-transform duration-200 block"
        >
            <Image
                src={category.image}
                alt={category.label}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold drop-shadow-lg">
                    {category.label}
                </span>
            </div>
        </Link>
    );
}

export function CategoriesSection({ title, description, buttonTitle, categories }) {
    return (
        <section className="relative bg-white py-8 sm:py-12">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6 sm:mb-8 md:mb-12">
                    <div className="flex items-end gap-2">
                        <Image
                            src="/images/Home/About/arrow-2.png"
                            alt=""
                            aria-hidden="true"
                            width={96}
                            height={60}
                            className="w-12 sm:w-16 h-auto hidden sm:block mt-2"
                        />
                        <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-[#5286A5] leading-tight mb-4 sm:mb-6">
                            {title}
                        </h2>

                    </div>
                    {description && (
                        <p className="text-base md:text-xl mb-4">
                            {description}
                        </p>
                    )}

                    <Button
                        asChild
                        className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
                    >
                        <Link href="/careers">{buttonTitle}</Link>
                    </Button>
                </div>

                {/* Mobile Carousel */}
                <div className="block md:hidden">
                    <Carousel
                        opts={{
                            align: "start",
                            direction: "rtl",
                            loop: true,
                            slidesToScroll: 1,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-mr-3 ml-0">
                            {categories.map((category, index) => (
                                <CarouselItem
                                    key={`${category.label}-${index}`}
                                    className="pr-3 pl-0 basis-[75%] sm:basis-1/2"
                                >
                                    <CategoryCard category={category} />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselDots className="mt-6" />
                    </Carousel>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {categories.map((category, index) => (
                        <CategoryCard
                            key={`${category.label}-${index}`}
                            category={category}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
