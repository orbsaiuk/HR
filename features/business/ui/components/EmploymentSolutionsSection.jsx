import Image from "next/image";

export function EmploymentSolutionsSection() {
  const solutions = [
    {
      title: "نشر الوظائف وتنظيم الطلبات",
      description:
        "نساعدك على نشر الوظائف وإدارة كل الطلبات في مكان واحد بشكل منظم، مع متابعة دقيقة لكل مرشح لحظة بلحظة، لتسهيل عملية التوظيف وتقليل الأخطاء.",
      image: "/images/business/image3.jpg",
      imageAlt: "نشر الوظائف",
      imagePosition: "right",
      arrow: (
        <div className="absolute -top-12 -right-22 w-35 h-19.5 hidden lg:block">
          <Image
            src="/images/business/arrow-1.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      ),
    },
    {
      title: "فرز ومقارنة المرشحين",
      description:
        "نوفر لك أدوات ذكية لفرز السير الذاتية ومقارنة المرشحين بسهولة، لتختار الأنسب بسرعة دون إهدار وقتك على مراجعة غير مهمة.",
      image: "/images/business/image4.jpg",
      imageAlt: "فرز ومقارنة المرشحين",
      imagePosition: "left",
      arrow: (
        <div className="absolute top-28 -left-20 w-[150px] h-[90px] hidden lg:block">
          <Image
            src="/images/business/arrow-2.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      ),
    },
    {
      title: "نشر الوظائف وتنظيم الطلبات",
      description:
        "نساعدك على نشر الوظائف وإدارة كل الطلبات في مكان واحد بشكل منظم، مع متابعة دقيقة لكل مرشح لحظة بلحظة، لتسهيل عملية التوظيف وتقليل الأخطاء.",
      image: "/images/business/image2.jpg",
      imageAlt: "إدارة التوظيف",
      imagePosition: "right",
      arrow: (
        <div className="absolute -top-22 -right-20 w-[130px] h-[90px] hidden lg:block">
          <Image
            src="/images/business/arrow-3.png"
            alt=""
            fill
            className="object-contain"
          />
        </div>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-3 md:mb-5">
            حلول التوظيف
          </h2>
          <p className="text-base md:text-xl text-gray-700 max-w-2xl mx-auto">
            نوفر لك أفضل الكفاءات بسهولة
          </p>
        </div>

        {/* Zigzag Rows */}
        <div className="flex flex-col gap-20 md:gap-32">
          {solutions.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20"
            >
              {/* Text Content */}
              <div
                className={`w-full lg:w-1/2 relative ${item.imagePosition === "right" ? "lg:order-2" : "lg:order-1"}`}
              >
                <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-right relative">
                  <h3 className="text-xl md:text-2xl  text-gray-900 mb-3 md:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-[1.8] text-sm md:text-lg relative z-10">
                    {item.description}
                  </p>

                  {/* Arrow container */}
                  {item.arrow}
                </div>
              </div>

              {/* Image Content */}
              <div
                className={`w-full lg:w-1/2 flex ${item.imagePosition === "right" ? "lg:order-1 lg:justify-end" : "lg:order-2 lg:justify-start"}`}
              >
                <div className="relative w-full max-w-[400px] mx-auto lg:mx-0 aspect-[4/3] rounded overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
