import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function JsLogoTile() {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E9C234] text-lg font-black text-white shadow-sm ring-1 ring-black/5">
      JS
    </div>
  );
}

export function ApplicationRow({ item, isLast }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between",
        !isLast && "border-b border-slate-100",
        "transition-colors hover:bg-slate-50/60",
      )}
    >
      <div className="flex items-start gap-4 sm:w-1/2 cursor-pointer">
        <JsLogoTile />
        <div className="space-y-1.5 text-right">
          <p className="text-base font-bold text-slate-900 leading-none">
            {item.title}
          </p>
          <p className="text-sm font-semibold text-slate-600">{item.company}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">{item.location}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1">{item.budget}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1">{item.level}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:w-1/4 sm:items-start text-right">
        <p className="text-xs font-medium text-slate-400">تاريخ التقديم</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {item.submittedAt}
        </p>
      </div>

      <div className="flex items-center justify-between sm:w-1/4 sm:justify-end gap-3">
        <Badge
          variant="secondary"
          className="rounded-lg border-[#F2BC6A]/30 bg-[#FFF8EB] px-3 py-1 text-xs font-semibold text-[#D79C3E] hover:bg-[#FFF8EB]"
        >
          {item.status}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          aria-label="خيارات الطلب"
        >
          <MoreHorizontal size={18} />
        </Button>
      </div>
    </div>
  );
}
