"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function UserHeroSection() {
  return (
    <section className="relative min-h-[320px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[550px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 container mx-auto rounded-none md:rounded-4xl overflow-hidden">
        <Image
          src="/images/Home/Hero/user.jpeg"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 sm:px-8 h-full flex items-center justify-center py-14 sm:py-20 md:py-24">
        <div className="text-center text-white max-w-3xl w-full">
          {/* Main heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.4] mb-4 sm:mb-6">
            ابدأ مسيرتك المهنية بثقة
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 leading-relaxed opacity-90 max-w-xl mx-auto">
            اكتشف فرص عمل حقيقية في شركات موثوقة تناسب مهاراتك وخبراتك
          </p>

          {/* CTA Button */}
          <Button
            asChild
            className="h-10 sm:h-11 md:h-12 px-8 sm:px-10 md:px-12 rounded-lg bg-white text-gray-900 hover:bg-white/90 font-medium text-sm sm:text-base w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            <Link href="/careers">تصفح الوظائف الآن</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
