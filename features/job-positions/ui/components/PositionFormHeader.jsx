"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PositionFormHeader({ title, backHref }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link href={backHref}>
          <ArrowRight size={20} />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-muted-foreground">
          {title.includes("إنشاء")
            ? "ادخل التفاصيل لإنشاء منصب وظيفي جديد."
            : "تعديل تفاصيل المنصب الوظيفي."}
        </p>
      </div>
    </div>
  );
}
