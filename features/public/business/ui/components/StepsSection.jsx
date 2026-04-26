import Image from "next/image";

const steps = [
  {
    number: "01",
    title: "إجراءات قانونية وتسجيل النشاط",
    description:
      "نرشدك لإتمام كل الإجراءات الرسمية والتراخيص بسرعة وسهولة، لتبدأ مشروعك بدون أي عقبات.",
  },
  {
    number: "02",
    title: "إعداد خطة عمل استراتيجية",
    description:
      "نساعدك على وضع خطة واضحة تشمل دراسة السوق وتحليل المنافسين لضمان قرارات مدروسة.",
  },
  {
    number: "03",
    title: "تنظيم الهيكل الإداري",
    description:
      "نصمم هيكل يوضح الأدوار والمسؤوليات لكل فرد لضمان سير العمل بسلاسة منذ البداية.",
  },
  {
    number: "04",
    title: "استشارات تشغيل وتطوير",
    description:
      "نوفر استشارات عملية لتنظيم التشغيل وتحسين الكفاءة، مع تجنب الأخطاء الشائعة في المراحل الأولى.",
  },
];

export function StepsSection() {
  return (
    <section className="bg-white py-8">
      <div className="container mx-auto">
        {/* Main heading */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-[1.3] mb-4 sm:mb-6 ">
            تأسيس{" "}
            <span className="relative inline-block z-1 px-3 sm:px-4 py-2">
              الشركات
              <Image
                src="/images/business/Vector.png"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 300px, 400px"
                className="object-fill -z-1 pointer-events-none"
              />
            </span>
          </h2>
          <p className="text-base md:text-2xl leading-relaxed mb-10 sm:mb-16">
            نساعدك على الانطلاق بأساس قانوني وتنظيمي قوي يضمن بداية مستقرة
            وواضحة.
          </p>
        </div>

        {/* Steps Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl mx-auto">
          {/* Right side */}
          <div>
            <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
              <div className="relative w-full h-full p-4 sm:p-6">
                <Image
                  src="/images/Business/steps.png"
                  alt="Business handshake"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Left side */}
          <div className="flex flex-col gap-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex flex-col items-start gap-4 text-right"
              >
                {/* Number */}
                <div className="shrink-0 bg-[#DBEEFF] rounded-full p-1">
                  <span className="text-3xl md:text-4xl font-bold text-[#5B9676] opacity-70">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg md:text-2xl mb-2 text-[#5B9676]">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
