"use client";

import { Badge } from "@/components/ui/badge";

const statusConfig = {
  new: { label: "New", variant: "default" },
  screening: { label: "Screening", variant: "secondary" },
  interview: { label: "Interview", variant: "outline" },
  offered: { label: "Offered", variant: "default" },
  hired: { label: "Hired", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const statusColors = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  screening: "bg-yellow-100 text-yellow-800 border-yellow-200",
  interview: "bg-purple-100 text-purple-800 border-purple-200",
  offered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  hired: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export function ApplicationStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.new;
  const colorClass = statusColors[status] || "";

  return (
    <Badge variant={config.variant} className={colorClass}>
      {config.label}
    </Badge>
  );
}
