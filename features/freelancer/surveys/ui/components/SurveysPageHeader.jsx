"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SurveysPageHeader({ onCreate }) {
  return (
    <div className="rounded-2xl bg-linear-to-l from-white via-purple-50/30 to-white px-5 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            الاستبيانات
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            أنشئ استبيانات لفهم متطلبات العملاء بشكل أفضل
          </p>
        </div>

        <Button
          onClick={onCreate}
          className="w-full cursor-pointer bg-[#4B2EE8] hover:bg-[#462EA8] sm:w-auto"
        >
          <Plus size={18} className="ml-1" />
          استبيان جديد
        </Button>
      </div>
    </div>
  );
}
