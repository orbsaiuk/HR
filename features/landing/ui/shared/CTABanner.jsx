"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const FLOATING_AVATARS = [
    {
        id: 1,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        top: "8%",
        start: "8%",
        size: "w-12 h-12 sm:w-14 sm:h-14",
    },
    {
        id: 2,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        top: "15%",
        start: "85%",
        size: "w-10 h-10 sm:w-12 sm:h-12",
    },
    {
        id: 3,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        top: "65%",
        start: "5%",
        size: "w-10 h-10 sm:w-12 sm:h-12",
    },
    {
        id: 4,
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        top: "70%",
        start: "90%",
        size: "w-12 h-12 sm:w-14 sm:h-14",
    },
    {
        id: 5,
        image: "https://randomuser.me/api/portraits/women/65.jpg",
        top: "40%",
        start: "3%",
        size: "w-8 h-8 sm:w-10 sm:h-10",
    },
    {
        id: 6,
        image: "https://randomuser.me/api/portraits/men/46.jpg",
        top: "35%",
        start: "92%",
        size: "w-8 h-8 sm:w-10 sm:h-10",
    },
];

export function CTABanner({
    title,
    description,
    buttonText,
    buttonHref,
    bgColor = "#5286A5",
}) {
    return (
        <section
            className="relative py-16 sm:py-20 md:py-28 px-4 sm:px-6 overflow-hidden text-white"
            style={{ backgroundColor: bgColor }}
        >
            {/* Floating avatar decorations */}
            {
                FLOATING_AVATARS.map((avatar) => (
                    <div
                        key={avatar.id}
                        className={`absolute ${avatar.size} rounded-full overflow-hidden shadow-lg animate-float-card hidden sm:block`}
                        style={{
                            top: avatar.top,
                            insetInlineStart: avatar.start,
                        }}
                    >
                        <Image
                            src={avatar.image}
                            alt=""
                            aria-hidden="true"
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>
                ))}

            {/* Content */}
            <div className="relative z-10 container mx-auto max-w-3xl text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-snug mb-4 sm:mb-6">
                    {title}
                </h2>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl leading-relaxed mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto">
                    {description}
                </p>
                <Button
                    asChild
                    className="h-11 sm:h-12 px-10 sm:px-14 rounded-lg bg-white text-black hover:bg-white/90 font-semibold text-sm sm:text-base"
                >
                    <Link href={buttonHref}>{buttonText}</Link>
                </Button>
            </div>
        </section>
    );
}
