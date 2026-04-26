import { Button } from "@/components/ui/button";
import { FileEdit, Filter, BarChart3, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const FEATURES = [
  {
    icon: FileEdit,
    title: "نشر وظائف ومشاريع بسهولة",
  },
  {
    icon: Filter,
    title: "فلترة دقيقة للمرشحين",
  },
  {
    icon: Award,
    title: "أدوات تقييم احترافية",
  },
  {
    icon: BarChart3,
    title: "تقارير وتحليلات لدعم القرار",
  },
];

export function AboutSection() {
  return (
    <section className="relative overflow-visible pt-2 md:pt-32" dir="rtl">
      <div
        className="relative z-10 flex flex-col md:flex-row bg-[#5286A51A] justify-center rounded-tr-[0px] md:rounded-tr-[250px] lg:rounded-tr-[350px]"
      >
        {/* Person image - Left side visually (right in RTL flow = first in DOM) */}
        <div className="relative md:w-[40%] lg:w-[43%] shrink-0 hidden md:flex items-end justify-center md:justify-start order-2 md:order-1 min-h-[200px] sm:min-h-[250px] md:min-h-0">
          <Image
            src="/images/Home/About/person.png"
            alt="شخص يستخدم المنصة"
            width={500}
            height={600}
            className="w-full max-w-[240px] sm:max-w-[300px] md:max-w-none md:w-full h-auto object-contain object-bottom -mt-16 sm:-mt-24 md:-mt-40 relative z-20"
          />
        </div>

        {/* Text content - Right side visually (left in RTL flow = second in DOM) */}
        <div className="relative z-10 md:w-[55%] lg:w-[52%] px-4 sm:px-6 md:px-12 lg:px-20 pt-8 sm:pt-10 pb-8 sm:pb-12 order-1 md:order-2">
          {/* Title and description */}
          <div className="text-center md:text-right max-w-4xl md:me-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.4] mb-3 md:mb-4">
              إعلانك يصل إلى المرشح المناسب
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-2xl mb-6 md:mb-8 leading-relaxed font-medium">
              انشر وظائفك أو مشاريعك بسهولة، وحدد المهارات المطلوبة و الميزانية.
            </p>
            <div className="flex justify-center md:justify-start">
              <Button
                asChild
                className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg bg-black hover:bg-black/90 text-white font-medium text-sm sm:text-base"
              >
                <Link href="/register-organization">أنشئ إعلانك الآن</Link>
              </Button>
            </div>
          </div>

          {/* "ماذا نوفر لك؟" Section */}
          <div className="mt-10 sm:mt-12 md:mt-16">
            <div className="flex items-center justify-center md:justify-start gap-4 sm:gap-6 mb-8 sm:mb-12">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                ماذا نوفر لك؟
              </h3>
              <Image
                src="/images/Home/About/arrow.png"
                alt=""
                aria-hidden="true"
                width={128}
                height={80}
                className="w-20 sm:w-24 md:w-32 h-auto hidden sm:block pt-6 md:pt-8"
              />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-10">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center gap-3 sm:gap-4 text-center justify-center"
                >
                  <feature.icon
                    className="w-10 h-10 sm:w-12 sm:h-12 text-black"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs sm:text-sm md:text-base lg:text-xl font-medium leading-snug">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
