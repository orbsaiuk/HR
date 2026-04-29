"use client";

import { BriefcaseBusiness, ClipboardList, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_ICONS = [BriefcaseBusiness, Gift, ClipboardList];

export function PositionCreateStepProgress({ currentStep, steps }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3" dir="rtl">
        {steps.map((step, index) => {
          const Icon = step.icon || DEFAULT_ICONS[index] || BriefcaseBusiness;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-3 px-2 py-1 md:px-4 md:py-2",
                index !== 0 && "md:border-s md:border-slate-200",
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                  isActive && "border-indigo-500 bg-indigo-500 text-white",
                  isCompleted &&
                    "border-indigo-200 bg-indigo-50 text-indigo-600",
                  !isActive &&
                    !isCompleted &&
                    "border-slate-200 bg-slate-50 text-slate-500",
                )}
              >
                <Icon size={17} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">
                  {index + 1}/{steps.length}
                </p>
                <p
                  className={cn(
                    "truncate text-sm font-semibold",
                    isActive ? "text-slate-900" : "text-slate-600",
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
