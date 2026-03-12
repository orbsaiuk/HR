"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import { JobCard } from "./JobCard";

const JOBS = [
  {
    id: 1,
    title: "مطور Full Stack",
    company: "شركة تقنية المستقبل",
    companyLogo: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "الرياض",
    salary: "15,000 - 20,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 2,
    title: "مصمم UI/UX",
    company: "شركة الإبداع الرقمي",
    companyLogo: "https://randomuser.me/api/portraits/women/44.jpg",
    location: "جدة",
    salary: "12,000 - 18,000",
    type: "دوام كامل",
    isRemote: false,
  },
  {
    id: 3,
    title: "مدير تسويق رقمي",
    company: "شركة النمو السريع",
    companyLogo: "https://randomuser.me/api/portraits/men/75.jpg",
    location: "الدمام",
    salary: "18,000 - 25,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 4,
    title: "محلل بيانات",
    company: "شركة البيانات الذكية",
    companyLogo: "https://randomuser.me/api/portraits/women/68.jpg",
    location: "الرياض",
    salary: "14,000 - 19,000",
    type: "دوام كامل",
    isRemote: true,
  },
  {
    id: 5,
    title: "مطور تطبيقات موبايل",
    company: "شركة التطبيقات المتقدمة",
    companyLogo: "https://randomuser.me/api/portraits/men/46.jpg",
    location: "جدة",
    salary: "16,000 - 22,000",
    type: "دوام كامل",
    isRemote: false,
  },
  {
    id: 6,
    title: "كاتب محتوى",
    company: "شركة المحتوى العربي",
    companyLogo: "https://randomuser.me/api/portraits/women/65.jpg",
    location: "عن بُعد",
    salary: "8,000 - 12,000",
    type: "دوام جزئي",
    isRemote: true,
  },
];

export function LatestJobsSection() {
  return (
    <section className="py-8 sm:py-12 bg-gray-50">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-12" dir="rtl">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-tight mb-2 sm:mb-3">
              أحدث الوظائف على المنصة
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-muted-foreground">
              تصفح أحدث الفرص التي نشرتها الشركات وابدأ التقديم اليوم
            </p>
          </div>
          <Button
            asChild
            className="h-10 sm:h-11 px-6 sm:px-8 rounded-lg font-medium text-sm sm:text-base w-full sm:w-auto shrink-0"
          >
            <Link href="/careers">استكشف كل الوظائف</Link>
          </Button>
        </div>

        {/* Jobs Carousel */}
        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-mr-4 ml-0">
            {JOBS.map((job) => (
              <CarouselItem
                key={job.id}
                className="pr-4 pl-0 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <JobCard job={job} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="mt-6 sm:mt-8" />
        </Carousel>
      </div>
    </section>
  );
}
