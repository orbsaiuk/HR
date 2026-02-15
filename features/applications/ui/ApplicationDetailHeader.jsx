"use client";

import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Button } from "@/components/ui/button";

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
          <Link href={`/dashboard/positions/${positionId}/applications`}>
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {applicantName || "Unknown Applicant"}
          </h1>
          <p className="text-muted-foreground">
            Applied to {positionTitle || "—"}
            {appliedAt && (
              <>
                {" "}
                ·{" "}
                {formatDistanceToNow(new Date(appliedAt), {
                  addSuffix: true,
                })}
              </>
            )}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ApplicationStatusBadge status={status} />
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 size={14} className="mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}
