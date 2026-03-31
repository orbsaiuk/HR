import { Clock, User, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function AppointmentCard({
  title,
  subtitle,
  time,
  date,
  person,
  type,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-[#E6E8F0] bg-white px-4 py-3",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 text-right min-w-0">
          <div className="flex items-center gap-1.5 text-[#3B445A]">
            <Clock className="h-4 w-4 text-[#5D43D8]" strokeWidth={1.9} />
            <h3 className="font-semibold text-[17px] leading-6 truncate">
              {title}
            </h3>
          </div>
          <p className="text-sm text-[#9AA1B3] leading-5 truncate">
            {subtitle}
          </p>
        </div>
        <Badge
          variant="secondary"
          className="shrink-0 rounded-full border-0 bg-[#F1ECFF] px-3 py-1 text-[11px] font-semibold text-[#6B54DC]"
        >
          {type}
        </Badge>
      </div>

      <div className="flex items-center justify-end gap-4 text-xs text-[#A7ADBD]">
        {person && (
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            <span>{person}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          <span>{time}</span>
        </div>
        {date && (
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
