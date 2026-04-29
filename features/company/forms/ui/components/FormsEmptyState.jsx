import { ClipboardList } from "lucide-react";

export function FormsEmptyState({ hasFilters }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
        <ClipboardList size={22} />
      </div>
      <p className="text-base font-semibold text-slate-700">
        {hasFilters ? "لا توجد نماذج مطابقة" : "لا توجد نماذج بعد"}
      </p>
      <p className="mt-1 text-sm text-slate-500">
        {hasFilters
          ? "جرب تعديل الفلاتر للحصول على نتائج أكثر."
          : "ابدأ بإنشاء نموذجك الأول لبدء استقبال الردود."}
      </p>
    </div>
  );
}
