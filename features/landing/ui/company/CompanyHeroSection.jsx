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

            <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-center">
                    {/* Right Column - Text Content (RTL) */}
                    <div className="text-center lg:text-right order-1 lg:col-span-2">
                        {/* Main heading */}
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.3] text-gray-900 mb-3 sm:mb-4 md:mb-6">
                            ابدأ ببناء{" "}
                            <span className="relative inline-block z-1 text-white px-2 sm:px-3 md:px-4 py-1">
                                فريقك الآن
                                <Image
                                    src="/images/Home/Hero/Vector.png"
                                    alt=""
                                    aria-hidden="true"
                                    fill
                                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 200px, 250px"
                                    className="object-fill -z-1 pointer-events-none"
                                />
                            </span>{" "}

                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base md:text-xl lg:text-3xl mb-5 sm:mb-8 md:mb-10 leading-relaxed mx-auto lg:mx-0 max-w-lg sm:max-w-xl lg:max-w-none">
                            انشر وظيفة جديدة، راجع المتقدمين، واعثر على أفضل المواهب لتنفيذ مشاريعك بسرعة وكفاءة.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
                            <Button
                                asChild
                                className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Link href="/dashboard/positions/create">انشر وظيفة جديدة</Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 rounded-lg border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base w-full sm:w-auto"
                            >
                                <Link href="/careers">تصفح الفريلانسرز</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Left Column - Company Images */}
                    {/* Mobile/Tablet: show side-by-side images */}
                    <div className="mdflex hidden order-2 justify-center gap-3 sm:gap-4 mt-2">
                        <div className="relative w-[45%] max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden">
                            <Image
                                src="/images/Home/Hero/company-1.png"
                                alt="فريق العمل"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 45vw, 200px"
                            />
                        </div>
                        <div className="relative w-[45%] max-w-[200px] aspect-[3/4] rounded-xl overflow-hidden mt-6 sm:mt-8">
                            <Image
                                src="/images/Home/Hero/company-2.png"
                                alt="بيئة العمل"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 45vw, 200px"
                            />
                        </div>
                    </div>

                    {/* Desktop: original overlapping layout */}
                    <div className="hidden lg:flex order-2 justify-end">
                        <div className="relative w-full max-w-[420px] h-[400px]">
                            {/* Company image 1 - positioned top-start */}
                            <div className="absolute top-0 start-0 w-[45%] h-[55%] rounded-2xl overflow-hidden">
                                <Image
                                    src="/images/Home/Hero/company-1.png"
                                    alt="فريق العمل"
                                    fill
                                    className="object-cover"
                                    sizes="230px"
                                />
                            </div>
                            {/* Company image 2 - positioned bottom-end */}
                            <div className="absolute bottom-0 end-0 w-[45%] h-[55%] rounded-2xl overflow-hidden">
                                <Image
                                    src="/images/Home/Hero/company-2.png"
                                    alt="بيئة العمل"
                                    fill
                                    className="object-cover"
                                    sizes="230px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
