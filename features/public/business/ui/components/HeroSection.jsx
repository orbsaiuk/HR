"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative bg-white overflow-hidden min-h-[auto] md:min-h-[580px] bg-hero">
      <div className="relative container mx-auto px-4 sm:px-6 py-10 sm:py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          {/* Right Column - Text Content (appears first in RTL) */}
          <div className="text-center lg:text-right order-1 lg:ps-4 col-span-1 lg:col-span-2">
            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.3] text-gray-900 mb-4 md:mb-6">
              حلول متكاملة{" "}
              <span className="relative inline-block z-1 text-white px-3 sm:px-4 py-3">
                لتأسيس أعمالك
                <Image
                  src="/images/Home/How/Vector-2.png"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
                  className="object-fill -z-1 pointer-events-none"
                />
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-4xl leading-relaxed mx-auto lg:mx-0">
              سواء كنت في بداية رحلتك الريادية أو تدير شركة تسعى للتوسع، نقدم لك
              خدمات أعمال متكاملة تساعدك على الانطلاق بثبات، وبناء فريق قوي،
              وتحقيق نمو مستدام.
            </p>

            {/* CTA Btn */}
            <Button
              className="h-10 sm:h-11 md:h-12 px-8 sm:px-10 md:px-12 rounded-lg text-base md:text-lg"
              onClick={() => router.push("/freelancer")}
            >
              ابدأ الآن
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
