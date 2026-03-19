"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const AVATARS = [
    {
        id: 1,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        image: "https://randomuser.me/api/portraits/men/44.jpg",
    },
    {
        id: 3,
        image: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    {
        id: 4,
        image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
];

export function FreelancerHeroSection() {
    const router = useRouter();
    return (
        <section className="relative bg-white overflow-hidden min-h-[auto] md:min-h-[580px] bg-hero">

            <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
                    {/* Right Column - Text Content (appears first in RTL) */}
                    <div className="text-center lg:text-right order-1 lg:ps-4 col-span-1 lg:col-span-2">
                        {/* Main heading */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl leading-[1.3] text-gray-900 mb-4 md:mb-6">
                            ابدأ رحلتك في <span className="text-[#5286A5]">العمل الحر</span> بسهولة… مهارتك هي المفتاح!
                        </h1>

                        {/* Subtitle */}
                        <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                            سجّل، أكمِل ملفك، وابدأ اكتشاف مشاريع وفرص عمل تناسبك.
                        </p>

                        {/* CTA Btn */}
                        <Button
                            className="h-10 sm:h-11 md:h-12 px-8 sm:px-10 md:px-12 rounded-lg text-base md:text-lg"
                            onClick={() => router.push("/freelancer/dashboard")}
                        >
                            ابدأ الآن
                        </Button>
                    </div>

                    {/* Left Column - Image Grid (appears second in RTL) */}
                    <div className="hidden lg:block relative order-2">
                        <div className="grid grid-cols-2 gap-4 max-w-sm">
                            {AVATARS.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100"
                                >
                                    <Image
                                        src={avatar.image}
                                        alt="Freelancer"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 200px"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}