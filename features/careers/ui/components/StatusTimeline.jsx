"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Clock, XCircle, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG = {
  new: {
    label: "Submitted",
    variant: "secondary",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Clock,
    description: "Your application has been received",
  },
  screening: {
    label: "Under Review",
    variant: "secondary",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    description: "Your application is being reviewed",
  },
  interview: {
    label: "Interview",
    variant: "secondary",
    className: "bg-purple-100 text-purple-700 border-purple-200",
    icon: Star,
    description: "You've been selected for an interview",
  },
  offered: {
    label: "Offer",
    variant: "secondary",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle,
    description: "An offer has been extended to you",
  },
  hired: {
    label: "Hired",
    variant: "secondary",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    description: "Congratulations! You've been hired",
  },
  rejected: {
    label: "Not Selected",
    variant: "destructive",
    className: "",
    icon: XCircle,
    description: "Your application was not selected",
  },
};

const PIPELINE_STAGES = ["new", "screening", "interview", "offered", "hired"];

export function StatusTimeline({ currentStatus }) {
  const isRejected = currentStatus === "rejected";
  const currentIndex = PIPELINE_STAGES.indexOf(currentStatus);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {PIPELINE_STAGES.map((stage, index) => {
          const config = STATUS_CONFIG[stage];
          const Icon = config.icon;
          const isActive = stage === currentStatus;
          const isCompleted = !isRejected && index < currentIndex;
          const isFuture = !isRejected && index > currentIndex;

          return (
            <div key={stage} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isRejected && isActive ? "bg-red-500 ring-red-100" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 whitespace-nowrap ${
                    isActive
                      ? "font-semibold text-gray-900"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {config.label}
                </span>
              </div>
              {index < PIPELINE_STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {isRejected && (
        <div className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {STATUS_CONFIG.rejected.description}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new;
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className={cn("gap-1", config.className)}>
      <Icon size={12} />
      {config.label}
    </Badge>
  );
}
