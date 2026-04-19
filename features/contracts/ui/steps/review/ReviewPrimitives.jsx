"use client";

import { Pen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReviewSectionHeader({
  icon: Icon,
  title,
  onEdit,
  editLabel = "تعديل",
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-2">
      <h4 className="flex items-center gap-2 text-base md:text-lg font-bold text-[#1F2937]">
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#5338D5]" />
        {title}
      </h4>
      {onEdit && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 gap-1 px-2 text-xs text-[#5338D5] hover:bg-[#F3EFFF] hover:text-[#462EA8]"
        >
          <Pen className="h-3 w-3" />
          {editLabel}
        </Button>
      )}
    </div>
  );
}

export function ReviewDetailItem({ label, value }) {
  return (
    <li className="flex items-start gap-1.5 text-sm leading-7 text-[#374151]">
      <span className="font-medium text-[#6B7280]">• {label}:</span>
      <span className="font-semibold text-[#1F2937]">
        {value || "___________"}
      </span>
    </li>
  );
}
