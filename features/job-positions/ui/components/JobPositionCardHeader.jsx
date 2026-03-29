"use client";

import Link from "next/link";
import {
  FileText,
  MoreHorizontal,
  Pencil,
  Pause,
  Play,
  Trash2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function JobPositionCardHeader({
  title,
  location,
  status,
  statusClassName,
  statusLabel,
  detailsHref,
  editHref,
  formHref,
  showActions,
  onStatusChange,
  onDelete,
  positionId,
}) {
  const canRenderMenu = Boolean(detailsHref || formHref || showActions);
  const hasEditAction = Boolean(showActions && editHref);
  const hasStatusActions = Boolean(showActions && onStatusChange && positionId);
  const hasDeleteAction = Boolean(showActions && onDelete && positionId);

  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1 text-right">
        <Link
          href={detailsHref}
          className="line-clamp-1 text-base font-semibold text-slate-800 hover:text-sky-700"
        >
          {title}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs font-medium text-rose-500">
          {location}
        </p>
        <Badge
          className={`mt-2 rounded-md px-2 py-0.5 text-[11px] font-semibold ${statusClassName}`}
        >
          {statusLabel}
        </Badge>
      </div>

      {canRenderMenu && (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={detailsHref}>عرض التفاصيل</Link>
            </DropdownMenuItem>

            {formHref && (
              <DropdownMenuItem asChild>
                <Link href={formHref} className="flex items-center gap-2">
                  <FileText size={14} />
                  عرض النموذج
                </Link>
              </DropdownMenuItem>
            )}

            {(hasEditAction || hasStatusActions || hasDeleteAction) && (
              <>
                <DropdownMenuSeparator />
                {hasEditAction && (
                  <DropdownMenuItem asChild>
                    <Link href={editHref} className="flex items-center gap-2">
                      <Pencil size={14} />
                      تعديل
                    </Link>
                  </DropdownMenuItem>
                )}

                {hasStatusActions && (
                  <>
                    {status !== "open" && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(positionId, "open")}
                        className="text-emerald-600 focus:text-emerald-600"
                      >
                        <Play size={14} />
                        نشر الوظيفة
                      </DropdownMenuItem>
                    )}
                    {status === "open" && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(positionId, "on-hold")}
                        className="text-amber-600 focus:text-amber-600"
                      >
                        <Pause size={14} />
                        تعليق الوظيفة
                      </DropdownMenuItem>
                    )}
                    {status !== "closed" && (
                      <DropdownMenuItem
                        onClick={() => onStatusChange(positionId, "closed")}
                        className="text-orange-600 focus:text-orange-600"
                      >
                        <XCircle size={14} />
                        إغلاق الوظيفة
                      </DropdownMenuItem>
                    )}
                  </>
                )}

                {hasDeleteAction && (
                  <>
                    {(hasEditAction || hasStatusActions) && (
                      <DropdownMenuSeparator />
                    )}
                    <DropdownMenuItem
                      onClick={() => onDelete(positionId)}
                      className="text-rose-600 focus:text-rose-600"
                    >
                      <Trash2 size={14} />
                      حذف
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
