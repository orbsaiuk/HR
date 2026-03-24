import Image from "next/image";

const features = [
  {
    title: "تحديد احتياجات الفريق",
    description: "تحليل دقيق للأدوار المطلوبة حسب مرحلة نمو شركتك.",
  },
  {
    title: "توزيع الأدوار بوضوح",
    description: "تنظيم المسؤوليات لضمان سير العمل بكفاءة وتقليل التضارب.",
  },
  {
    title: "أنظمة متابعة وتطوير الأداء",
    description: "آليات واضحة لقياس الأداء وتحسين الإنتاجية بشكل مستمر.",
  },
];

export function TeamBuildingSection() {
  return (
    <section className="bg-white py-12 md:py-20 relative overflow-hidden">
      {/* The curved container */}
      <div
        className="relative bg-[#5A8BA8] w-full min-h-[600px] rounded-t-[50%] md:rounded-t-[50%] -mt-10 pt-20 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 z-0"
        style={{
          borderTopLeftRadius: "100% 15%",
          borderTopRightRadius: "100% 15%",
        }}
      >
        <div className="container mx-auto max-w-6xl relative z-10">
          {/* Header */}
          <div className="text-center text-white mb-12 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 md:mb-6">
              بناء وتطوير فرق العمل
            </h2>
            <p className="text-base sm:text-lg md:text-xl max-w-4xl mx-auto leading-relaxed opacity-95">
              نساعدك على بناء فرق عمل واضحة الهيكل والأدوار، مع أنظمة متابعة
              تضمن كفاءة الأداء واستمرارية التطوير.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Right side (Text Cards) - in RTL it's on the right */}
            <div className="flex flex-col gap-4 md:gap-6 order-2 lg:order-1">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded p-6 sm:p-8 shadow-sm transition-transform hover:-translate-y-1 duration-300 text-right"
                >
                  <h3 className="text-xl md:text-2xl text-gray-900 mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-lg text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Left side (Images Composition) */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square max-w-[500px] mx-auto lg:max-w-none lg:h-[600px] order-1 lg:order-2">
              {/* Top Left Image (Notebooks) */}
              <div className="absolute left-0 sm:-left-4 top-[5%] w-[60%] h-[50%] -rotate-12 rounded shadow-lg z-10 border border-white/20 overflow-hidden">
                <Image
                  src="/images/Business/image2.jpg"
                  alt="تطوير"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Bottom Left Image (Blocks) */}
              <div className="absolute left-[5%] sm:left-2 bottom-[10%] w-[65%] h-[45%] rotate-6 rounded shadow-lg z-10 border border-white/20 overflow-hidden">
                <Image
                  src="/images/business/image3.jpg"
                  alt="وظائف"
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>

              {/* Right Image (Handshake - Main) */}
              <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-[55%] sm:w-[60%] h-[75%] rounded-xl shadow-2xl z-20 border-[6px] border-white overflow-hidden">
                <Image
                  src="/images/Business/Image.png"
                  alt="شراكة"
                  fill
                  sizes="(max-width: 768px) 50vw, 400px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
