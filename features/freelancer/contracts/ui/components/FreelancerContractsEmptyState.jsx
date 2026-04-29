import { FileText } from "lucide-react";

/**
 * Shown when the freelancer has no contracts yet.
 */
export function FreelancerContractsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <FileText className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-slate-700">لا توجد عقود حالياً</h3>
      <p className="max-w-xs text-sm text-slate-500">
        العقود التي ترسلها الشركات ستظهر هنا. تابع طلباتك المقدمة والردود عليها.
      </p>
    </div>
  );
}
