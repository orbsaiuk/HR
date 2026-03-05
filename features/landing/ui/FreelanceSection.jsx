import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function FreelanceSection() {
    return (
        <section className="py-12 sm:py-16 md:py-24" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-20">
                    {/* Text content - Right side visually (left in RTL = second in DOM) */}
                    <div className="w-full md:w-1/2 text-center md:text-right">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black leading-[1.4] mb-4 sm:mb-6 relative inline-block">
                            حوّل مهاراتك إلى مشاريع حقيقية
                            <Image
                                src="/images/Home/Freelance/Line-1.png"
                                alt=""
                                aria-hidden="true"
                                width={400}
                                height={20}
                                className="absolute -bottom-3 sm:-bottom-4 left-0 w-auto h-auto pointer-events-none"
                            />
                        </h2>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium mb-6 sm:mb-8 max-w-lg mx-auto md:mx-0">
                            إذا كنت تبحث عن فرصة سريعة أو ترغب بتنفيذ مشروع محدد، يمكنك
                            التقديم على مشاريع قصيرة أو متوسطة المدى والعمل مع شركات تبحث عن
                            خبرات متخصصة.
                        </p>

                        <div className="flex justify-center md:justify-start">
                            <Button
                                asChild
                                className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg bg-black hover:bg-black/90 text-white font-medium text-sm sm:text-base"
                            >
                                <Link href="/careers">تصفح المشاريع</Link>
                            </Button>
                        </div>
                    </div>
                    {/* Image - Left side visually (right in RTL = first in DOM) */}
                    <div className="w-full md:w-1/2 flex justify-center">
                        <Image
                            src="/images/Home/Freelance/Freelance.png"
                            alt="فريلانسرز يعملون على مشاريع"
                            width={600}
                            height={500}
                            className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-none h-auto object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
