"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplicationsPageHeader({ positionId, totalApplications }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/company/positions/${positionId}`}>
          <ArrowRight size={20} />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">طلبات التقديم</h1>
        <p className="text-sm text-muted-foreground">
          {totalApplications} {totalApplications === 1 ? "متقدم" : "متقدمين"} في
          مسار التوظيف
        </p>
      </div>
    </div>
  );
}
