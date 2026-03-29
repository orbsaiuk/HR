"use client";

import { Eye, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  STATUS_CLASSES,
  STATUS_LABELS,
  TAG_CLASSES,
  TYPE_LABELS,
} from "../lib/jobPositionCard.constants";
import {
  formatNumber,
  formatSalary,
  getDaysRemaining,
  getTimelineProgress,
  getDefaultTags,
  resolvePositionId,
} from "../lib/jobPositionCard.utils";
import { JobPositionCardHeader } from "./components";

export function JobPositionCard({
  position,
  showActions = false,
  onDelete,
  onStatusChange,
  detailsHref,
  editHref,
  className,
}) {
  const positionId = resolvePositionId(position);
  const title = position?.title || "بدون عنوان";
  const location = position?.location || "الموقع غير محدد";
  const description =
    position?.description || "لا يوجد وصف متاح لهذه الوظيفة حالياً.";
  const salaryLabel = formatSalary(position);
  const typeLabel =
    position?.workType || TYPE_LABELS[position?.type] || "نوع العمل";
  const levelLabel = position?.level || "مستوى متقدم";
  const status = position?.status || "draft";
  const statusLabel = STATUS_LABELS[status] || status;
  const applicationsCount =
    position?.applicationCount ?? position?.applications ?? 0;
  const viewsCount =
    position?.viewsCount ?? position?.viewCount ?? position?.views ?? 0;
  const remainingDays =
    position?.daysRemaining ??
    (position?.deadline ? getDaysRemaining(position.deadline) : null);
  const progressValue =
    position?.timelineProgress ??
    getTimelineProgress(position?.createdAt, position?.deadline);
  const tags =
    Array.isArray(position?.tags) && position.tags.length > 0
      ? position.tags.slice(0, 3)
      : getDefaultTags(position, levelLabel);

  const resolvedDetailsHref =
    detailsHref ||
    (positionId ? `/company/positions/${positionId}` : "/company/positions");
  const resolvedEditHref =
    editHref || (positionId ? `/company/positions/${positionId}/edit` : null);
  const formHref = position?.form?._id
    ? `/company/forms/${position.form._id}`
    : null;

  return (
    <Card className={cn("h-full border-slate-200 shadow-sm", className)}>
      <CardContent className="space-y-4 p-4">
        <JobPositionCardHeader
          title={title}
          location={location}
          status={status}
          statusLabel={statusLabel}
          statusClassName={STATUS_CLASSES[status] || STATUS_CLASSES.draft}
          detailsHref={resolvedDetailsHref}
          editHref={resolvedEditHref}
          formHref={formHref}
          showActions={showActions}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
          positionId={positionId}
        />

        <div className="grid grid-cols-3 gap-2 text-sm font-semibold text-slate-700">
          <p className="truncate">{salaryLabel}</p>
          <p className="truncate text-center">{typeLabel}</p>
          <p className="truncate text-left">{levelLabel}</p>
        </div>

        <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              className={cn(
                "rounded-sm px-3 py-1 text-xs font-semibold",
                TAG_CLASSES[index % TAG_CLASSES.length],
              )}
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-end gap-4 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Users size={14} />
              {formatNumber(applicationsCount)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={14} />
              {formatNumber(viewsCount)}
            </span>
          </div>

          {remainingDays != null ? (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>الأيام المتبقية</span>
                <span>{formatNumber(remainingDays)} يوم</span>
              </div>
              <Progress
                value={progressValue}
                className="h-1.5 bg-slate-200 transform-[scaleX(-1)] [&>div]:bg-violet-600"
              />
            </>
          ) : (
            <p className="text-xs text-slate-500">
              تاريخ النشر: {position?.postedAt || "غير محدد"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
