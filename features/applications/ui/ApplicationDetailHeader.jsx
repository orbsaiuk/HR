"use client";

import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function ApplicationDetailHeader({
  applicantName,
  positionTitle,
  appliedAt,
  status,
  positionId,
  onDelete,
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
        <PermissionGate permission={PERMISSIONS.MANAGE_APPLICATIONS}>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 size={14} className="ml-1" />
            حذف الطلب
          </Button>
        </PermissionGate>
      </div>
    </div>
  );
}
