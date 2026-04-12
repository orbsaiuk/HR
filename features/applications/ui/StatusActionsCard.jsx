"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/features/org-members-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

const STATUS_OPTIONS = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

const STATUS_LABELS = {
  new: "جديد",
  screening: "فرز أولي",
  interview: "مقابلة",
  offered: "عرض وظيفي",
  hired: "تم التوظيف",
  rejected: "مرفوض",
};

export function StatusActionsCard({ status, onStatusChange, isLoading }) {
  const { hasPermission } = usePermissions();
  const canManageApplications = hasPermission(PERMISSIONS.MANAGE_APPLICATIONS);

  if (!canManageApplications) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">تحديث الحالة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              type="button"
              size="sm"
              variant={status === s ? "default" : "outline"}
              disabled={isLoading}
              onClick={() => onStatusChange(s)}
              className="text-xs"
            >
              {STATUS_LABELS[s] || s}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
