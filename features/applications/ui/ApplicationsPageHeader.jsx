"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplicationsPageHeader({ positionId, totalApplications }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/dashboard/positions/${positionId}`}>
          <ArrowLeft size={20} />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <p className="text-sm text-muted-foreground">
          {totalApplications} candidate{totalApplications !== 1 && "s"} in
          pipeline
        </p>
      </div>
    </div>
  );
}
