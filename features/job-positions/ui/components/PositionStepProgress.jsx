"use client";

import { Progress } from "@/components/ui/progress";
import { Lightbulb } from "lucide-react";

export function PositionStepProgress({ currentStep, steps }) {
  const totalSteps = steps.length || 1;
  const stepLabel = steps[currentStep]?.label || "";
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-blue-600" size={18} />
          <p className="font-medium text-blue-900">Form Progress</p>
        </div>
        <span className="text-sm font-semibold text-blue-700">
          {percent}% Complete
        </span>
      </div>
      <Progress value={percent} className="h-2" />
      <div className="flex items-center justify-between text-xs text-blue-700">
        <span>
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{stepLabel}</span>
      </div>
    </div>
  );
}
