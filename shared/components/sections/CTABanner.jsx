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
  titleColor = "text-white",
  description,
  descriptionColor = "text-white",
  buttonText,
  buttonColor = "text-white hover:bg-white/90",
  buttonHref,
  bgColor = "#5286A5",
}) {
  return (
    <section
      className="relative py-12 sm:py-16 md:py-20 lg:py-28 px-4 sm:px-6 overflow-hidden text-white"
      style={{ backgroundColor: bgColor }}
    >
      {/* Floating avatar decorations - hidden on mobile, shown on larger screens */}
      {FLOATING_AVATARS.map((avatar) => (
        <div
          key={avatar.id}
          className={`absolute ${avatar.size} rounded-full overflow-hidden shadow-lg animate-float-card hidden md:block`}
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
      <div className="relative z-10 container mx-auto text-center">
        <h2
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-snug mb-3 sm:mb-4 md:mb-6 ${titleColor}`}
        >
          {title}
        </h2>
        <p
          className={`text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-relaxed mb-5 sm:mb-6 md:mb-8 lg:mb-10 max-w-2xl lg:max-w-3xl mx-auto px-2 sm:px-0 ${descriptionColor}`}
        >
          {description}
        </p>
        <Button
          className={`h-10 sm:h-11 md:h-12 px-8 sm:px-10 md:px-14 rounded-lg ${buttonColor} font-semibold text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none`}
        >
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}
