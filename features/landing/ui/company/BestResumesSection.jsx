"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const RESUME_CATEGORIES = [
    {
        label: "برمجه",
        image: "/images/Home/CV/cv-4.png",
    },
    {
        label: "كتابه",
        image: "/images/Home/CV/cv-3.png",
    },
    {
        label: "التصميم",
        image: "/images/Home/CV/cv-2.png",
    },
    {
        label: "اداره اعمال",
        image: "/images/Home/CV/cv-1.png",
    },
    {
        label: "اخرى",
        image: "/images/Home/CV/cv-1.png",
    },
    {
        label: "كتابه",
        image: "/images/Home/CV/cv-2.png",
    },
    {
        label: "تسويق",
        image: "/images/Home/CV/cv-3.png",
    },
    {
        label: "اداره اعمال",
        image: "/images/Home/CV/cv-4.png",
    },
];

export function BestResumesSection() {
    return (
        <section className="relative bg-white py-12">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
                    <div className="flex items-end gap-2">
                        <Image
                            src="/images/Home/About/arrow-2.png"
                            alt=""
                            aria-hidden="true"
                            width={96}
                            height={60}
                            className="w-16 h-auto hidden sm:block mt-2"
                        />
                        <h2 className="text-2xl md:text-5xl text-[#5286A5] leading-tight mb-6">
                            قائمة افضل السير الذاتيه
                        </h2>

                    </div>

                    <Button
                        asChild
                        className="h-11 sm:h-12 px-8 sm:px-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm sm:text-base w-full sm:w-auto"
                    >
                        <Link href="/careers">عرض جميع السير الذاتيه</Link>
                    </Button>

                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                    {RESUME_CATEGORIES.map((category, index) => (
                        <Link
                            key={`${category.label}-${index}`}
                            href="/careers"
                            className="group relative overflow-hidden rounded-2xl aspect-[2/1] cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                        >
                            <Image
                                src={category.image}
                                alt={category.label}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-200" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-base sm:text-lg md:text-xl font-bold drop-shadow-lg">
                                    {category.label}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
