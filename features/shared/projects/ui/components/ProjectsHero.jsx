"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function ProjectsHero({ search, onSearchChange, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/Careers/bg.png')" }}
      />

      <div className="container mx-auto px-4 py-10 sm:py-16 md:py-20 text-center relative z-10">
        {/* Main heading */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight text-gray-900">
          استكشف{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-red-700">مشاريعنا</span>
            {/* Line.png underline image */}
            <Image
              src="/images/Careers/Line.png"
              alt=""
              width={160}
              height={12}
              className="absolute -bottom-1 right-0 left-0 w-full h-auto z-0 pointer-events-none"
              aria-hidden="true"
            />
          </span>{" "}
          المتميزة
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-1 sm:mb-2 leading-relaxed">
          تصفح مجموعة من المشاريع المتنوعة التي نفذناها بنجاح مع عملائنا.
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed">
          ابحث في المشاريع حسب التقنية أو المجال أو نوع المشروع واكتشف خبراتنا.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-3 max-w-3xl mx-auto justify-center"
          dir="rtl"
        >
          {/* Search input */}
          <div className="relative w-full sm:flex-1">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث في المشاريع (اسم، تقنية، عميل...)"
              className="pr-10 pl-3 bg-white border border-gray-300 rounded-md text-gray-800 placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-gray-400 h-12 text-right text-sm w-full"
            />
          </div>

          {/* Search button */}
          <Button
            type="submit"
            className="bg-[#1a1a1a] hover:bg-[#333] text-white h-12 px-10 rounded-md font-medium text-sm w-full sm:w-auto"
          >
            بحث
          </Button>
        </form>
      </div>
    </section>
  );
}
