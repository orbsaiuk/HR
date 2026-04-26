"use client";

import Image from "next/image";

const WHY_FEATURES = [
  {
    title: "فرص عمل محدثة يومياً",
    vector: "/images/Home/How/Vector-1.png",
    description:
      "نقوم بتحديث قائمة الوظائف بشكل مستمر لضمان وصولك إلى أحدث الفرص المتاحة في مختلف التخصصات.",
  },
  {
    title: "شركات موثوقة في مختلف المجالات",
    vector: "/images/Home/How/Vector-2.png",
    description:
      "نتعاون مع شركات معتمدة وموثوقة تبحث عن كفاءات حقيقية، مما يمنحك فرصاً أكثر جدية واستقراراً.",
  },
  {
    title: "تقديم سهل وسريع",
    vector: "/images/Home/How/Vector-3.png",
    description:
      "يمكنك التقديم على الوظائف بخطوات بسيطة دون إجراءات معقدة، لتبدأ رحلتك المهنية بسهولة.",
  },
];

export function UserWhySection() {
  return (
    <section className="py-10 sm:py-16 md:py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-8 sm:mb-14 md:mb-16">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-center">
            لماذا تبحث عن وظيفة من خلالنا؟
          </h2>
          <Image
            src="/images/Home/About/arrow.png"
            alt=""
            aria-hidden="true"
            width={80}
            height={80}
            className="w-14 sm:w-16 md:w-20 h-auto mt-2 sm:mt-4 hidden sm:block"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-6 md:gap-8">
          {WHY_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-0"
            >
              {/* Brush-stroke Badge with Vector Image */}
              <div className="relative inline-flex items-center justify-center mb-1 sm:mb-2">
                <Image
                  src={feature.vector}
                  alt=""
                  aria-hidden="true"
                  width={200}
                  height={56}
                  className="w-48 sm:w-48 md:w-56 h-auto"
                />
                <div className="absolute inset-0 flex items-center justify-center px-3">
                  <span className="text-white font-bold text-sm sm:text-sm md:text-base leading-tight text-center">
                    {feature.title}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
