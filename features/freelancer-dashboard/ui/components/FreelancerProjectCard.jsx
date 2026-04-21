import { Clock3, Ellipsis, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: {
    label: "نشط",
    className: "bg-[#EEE9FF] text-[#6C4CF1]",
  },
  completed: {
    label: "مكتمل",
    className: "bg-[#EAF5EE] text-[#4C9A73]",
  },
};

const dateFormatter = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "short",
});

function formatDays(value) {
  if (value === 0) return "0 يوم";
  if (value === 1) return "يوم واحد";
  if (value === 2) return "يومان";
  if (value <= 10) return `${value} أيام`;
  return `${value} يوما`;
}

function getDateRangeLabel(startDate, totalDays) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + Math.max(totalDays, 1));

  return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

export function FreelancerProjectCard({ project, progress }) {
  const status = statusConfig[project.status];

  return (
    <Card className="rounded-[10px] border border-[#E4E8F1] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)] transition-shadow hover:shadow-[0_4px_10px_rgba(16,24,40,0.08)]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 text-right">
            <h3 className="truncate text-xl font-medium leading-tight text-[#1F2937] sm:text-[25px] sm:leading-8">
              {project.title}
            </h3>
            <p className="mt-1 truncate text-sm text-[#9CA3AF]">
              {project.clientName}
            </p>
          </div>

          <Badge
            className={cn(
              "inline-flex h-7 shrink-0 items-center rounded-full border-none px-4 text-sm font-medium",
              status.className,
            )}
          >
            {status.label}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-[#6B7280]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} strokeWidth={2} />
            {getDateRangeLabel(project.startDate, project.totalDays)}
          </span>
          <span className="text-lg font-medium leading-tight tracking-tight text-[#6B7280] sm:text-[22px] sm:leading-7">
            {project.budget}
          </span>
        </div>

        {project.status === "active" ? (
          <div className="mt-4" title={`متبقي ${progress.remainingDays} يوم`}>
            <div className="flex items-center gap-2">
              <Progress
                value={progress.percent}
                className="h-1.25 flex-1 scale-x-[-1] bg-[#E5E7EB]"
                indicatorClassName="bg-[#4B2EE8]"
              />
              <span className="text-xs font-medium text-[#6B7280]">
                {progress.percent}%
              </span>
            </div>

            <div className="mt-2 text-[11px] font-medium">
              <span className="text-[#4B2EE8]">{`المتبقي ${formatDays(progress.remainingDays)}`}</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-end gap-1.5 text-sm font-medium text-[#4C9A73]">
            <CheckCircle2 size={14} strokeWidth={2} />
            <span>تم التسليم بنجاح</span>
          </div>
        )}

        <Separator className="my-4 bg-[#E5E7EB]" />

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            className="h-8 rounded-md border-[#CFC6FF] px-4 text-sm font-medium text-[#4B2EE8] hover:bg-[#F6F3FF] hover:text-[#4B2EE8]"
          >
            تفاصيل المشروع
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-[#111827] hover:bg-slate-100"
            aria-label="المزيد من الخيارات"
          >
            <Ellipsis size={18} strokeWidth={2.5} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
