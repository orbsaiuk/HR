"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";

export function ApplicationDetailHeader({
  applicantName,
  positionTitle,
  appliedAt,
  status,
  positionId,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/company/positions/${positionId}/applications`}>
            <ArrowRight size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {applicantName || "متقدم غير معروف"}
          </h1>
          <p className="text-muted-foreground">
            تقدم على {positionTitle || "—"}
            {appliedAt && (
              <>
                {" "}
                ·{" "}
                {formatDistanceToNow(new Date(appliedAt), {
                  addSuffix: true,
                  locale: ar,
                })}
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ApplicationStatusBadge status={status} />
      </div>
    </div>
  );
}
