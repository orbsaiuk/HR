"use client";

import { CheckCircle2, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_STYLES = {
  فريلانسر: "bg-[#F1EEFF] text-[#6D57D2]",
  "دوام كامل": "bg-[#EAF8EF] text-[#4D9963]",
  "دوام جزئي": "bg-[#FFF5EA] text-[#D7863A]",
  تدريب: "bg-[#FFF4EA] text-[#C5883D]",
};

export function ContractTemplateCard({ template, onUse, canManage = true }) {
  const badgeClass =
    CATEGORY_STYLES[template.category] || "bg-[#EEF2FF] text-[#6B7280]";

  return (
    <article
      className="rounded-lg border border-[#E4E8F2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
      dir="rtl"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${badgeClass}`}
        >
          {template.category}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-bold leading-8 text-[#1F2937]">
        {template.title}
      </h3>

      <p className="mt-2 min-h-12 text-sm leading-6 text-[#6B7280]">
        {template.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#8A94A7]">
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" />
          {template.lastUsed}
        </span>

        <span className="inline-flex items-center gap-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          استخدم {template.usageCount} مرة
        </span>
      </div>

      {canManage ? (
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            onClick={() => onUse(template)}
            className="h-9 rounded-md bg-[#5338D5] px-5 text-sm hover:bg-[#462EA8]"
          >
            استخدم وأرسل
          </Button>
        </div>
      ) : null}
    </article>
  );
}
