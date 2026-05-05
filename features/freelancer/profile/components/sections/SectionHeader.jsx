"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";

export function SectionHeader({
  title,
  count,
  section,
  isEmpty,
  onEdit,
  onAdd,
}) {
  const displayTitle =
    typeof count === "number" ? `${title} (${count})` : title;

  return (
    <CardHeader className="flex-row items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
      <CardTitle className="text-lg font-bold text-slate-700 sm:text-2xl">
        {displayTitle}
      </CardTitle>

      <div className="flex items-center gap-2">
        {onAdd && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            aria-label={`إضافة ${displayTitle}`}
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        {!isEmpty && onEdit && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            aria-label={`تعديل قسم ${displayTitle}`}
            onClick={() => onEdit?.(section)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </CardHeader>
  );
}
