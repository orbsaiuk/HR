"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function CompanyHeroSection() {
    return (
        <section className="relative bg-white overflow-hidden min-h-[auto] md:min-h-[580px] bg-hero">
            {/* Decorative hand-drawn arrow */}
            <Image
                src="/images/Home/Hero/hero-arrow.png"
                alt=""
                aria-hidden="true"
                width={64}
                height={64}
                className="absolute top-4 start-[280px] w-16 h-auto z-10 pointer-events-none hidden md:block"
            />

            <div className="relative container mx-auto px-4 sm:px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center">
                    {/* Right Column - Text Content (RTL) */}
                    <div className="text-center lg:text-right order-1 col-span-2">
                        {/* Main heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.3] text-gray-900 mb-4 md:mb-6">
                            ابدأ ببناء{" "}
                            <span className="relative inline-block z-1 text-white px-3 sm:px-4 py-1">
                                فريقك الآن
                                <Image
                                    src="/images/Home/Hero/Vector.png"
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px"
                                    className="object-fill -z-1 pointer-events-none"
                                />
                            </span>{" "}

                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base md:text-3xl mb-6 sm:mb-8 md:mb-10 leading-relaxed mx-auto lg:mx-0">
                            انشر وظيفة جديدة، راجع المتقدمين، واعثر على أفضل المواهب لتنفيذ مشاريعك بسرعة وكفاءة.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                            <Button
                                asChild
                                className="h-11 sm:h-12 px-8 sm:px-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Link href="/dashboard/positions/create">انشر وظيفة جديدة</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 sm:h-12 px-8 sm:px-10 rounded-lg border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Link href="/careers">تصفح الفريلانسرز</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Left Column - Company Images */}
                    <div className="hidden lg:flex order-2 justify-end">
                        <div className="relative w-full max-w-[420px] h-[400px]">
                            {/* Company image 1 - positioned top-start */}
                            <div className="absolute top-0 start-0 w-[45%] h-[55%] rounded-2xl overflow-hidden">
                                <Image
                                    src="/images/Home/Hero/company-1.png"
                                    alt="فريق العمل"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 230px, 230px"
                                />
                            </div>
                            {/* Company image 2 - positioned bottom-end */}
                            <div className="absolute bottom-0 end-0 w-[45%] h-[55%] rounded-2xl overflow-hidden">
                                <Image
                                    src="/images/Home/Hero/company-2.png"
                                    alt="بيئة العمل"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 230px, 230px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
