"use client";

import { ClipboardList } from "lucide-react";

export function SurveysEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B2EE8]/10 text-[#4B2EE8]">
        <ClipboardList size={22} />
      </div>
      <p className="text-base font-semibold text-slate-700">
        لا توجد استبيانات بعد
      </p>
      <p className="mt-1 text-sm text-slate-500">
        ابدأ بإنشاء استبيانك الأول لفهم متطلبات عملائك بشكل أفضل.
      </p>
    </div>
  );
}
