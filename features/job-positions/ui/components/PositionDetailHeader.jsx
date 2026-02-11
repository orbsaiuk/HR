"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Edit,
  Trash2,
  Play,
  Pause,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANT = {
  draft: "secondary",
  open: "default",
  "on-hold": "outline",
  closed: "destructive",
};

const STATUS_LABELS = {
  draft: "Draft",
  open: "Open",
  "on-hold": "On Hold",
  closed: "Closed",
};

const TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

export function PositionDetailHeader({
  position,
  positionId,
  onStatusChange,
  onDelete,
}) {
  const statusVariant = STATUS_VARIANT[position.status] || "secondary";
  const statusLabel = STATUS_LABELS[position.status] || position.status;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="mt-0.5">
          <Link href="/dashboard/positions">
            <ArrowLeft size={20} />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {position.title}
            </h1>
            <Badge variant={statusVariant}>{statusLabel}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            {position.department && (
              <span className="flex items-center gap-1">
                <Briefcase size={14} />
                {position.department}
              </span>
            )}
            {position.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {position.location}
              </span>
            )}
            <span>{TYPE_LABELS[position.type] || position.type}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {position.status !== "open" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange("open")}
            className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-600"
          >
            <Play size={14} />
            Open
          </Button>
        )}
        {position.status === "open" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange("on-hold")}
            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:text-yellow-600"
          >
            <Pause size={14} />
            Hold
          </Button>
        )}
        {position.status !== "closed" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onStatusChange("closed")}
            className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
          >
            <XCircle size={14} />
            Close
          </Button>
        )}
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/positions/${positionId}/edit`}>
            <Edit size={14} />
            Edit
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 size={14} />
          Delete
        </Button>
      </div>
    </div>
  );
}
