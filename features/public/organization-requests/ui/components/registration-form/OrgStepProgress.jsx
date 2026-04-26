"use client";

import { Building2, Globe, FileText, CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "basic", label: "البيانات الأساسية", icon: Building2 },
  { id: "social", label: "التواصل والوسائط", icon: Globe },
  { id: "legal", label: "المعلومات القانونية", icon: FileText },
  { id: "review", label: "المراجعة والإرسال", icon: CheckCircle },
];

/**
 * Enhanced visual step progress indicator for the organization registration wizard.
 * Shows 4 steps with icons, animations, and completion status.
 */
export function OrgStepProgress({ currentStep }) {
  return (
    <div className="mb-10" role="navigation" aria-label="Form progress">
      <div className="relative">
        {/* Desktop view */}
        <div className="hidden md:flex items-center justify-between relative px-4">
          {/* Progress line background */}
          <div
            className="absolute top-7 right-16 left-16 h-1 bg-muted/60 rounded-full"
            aria-hidden="true"
          />

          {/* Active progress line with gradient and animation */}
          <div
            className="absolute top-7 right-16 h-1 bg-gradient-to-l from-primary via-primary to-primary/80 rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{
              width: `calc(${(currentStep / (STEPS.length - 1)) * 100}% - 128px)`,
              boxShadow:
                currentStep > 0 ? "0 0 12px rgba(var(--primary), 0.4)" : "none",
            }}
            aria-hidden="true"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center animate-in fade-in duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 shadow-sm",
                    isCompleted &&
                      "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25 scale-100",
                    isCurrent &&
                      "bg-primary border-primary text-primary-foreground ring-4 ring-primary/20 scale-110 shadow-xl shadow-primary/30",
                    isPending &&
                      "bg-background border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50 hover:scale-105",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <Check
                      size={24}
                      className="animate-in zoom-in duration-300"
                    />
                  ) : (
                    <Icon size={22} />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-3 text-xs font-semibold text-center max-w-[90px] transition-all duration-300",
                    (isCompleted || isCurrent) && "text-foreground",
                    isCurrent && "scale-105",
                    isPending && "text-muted-foreground",
                  )}
                >
                  {step.label}
                </span>
                {/* Step number badge */}
                <span
                  className={cn(
                    "mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-all",
                    (isCompleted || isCurrent) && "bg-primary/10 text-primary",
                    isPending && "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1} / {STEPS.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile view - Simplified horizontal stepper */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between px-4">
            <div className="text-sm font-medium">
              الخطوة {currentStep + 1} من {STEPS.length}
            </div>
            <div className="text-xs text-muted-foreground">
              {STEPS[currentStep]?.label}
            </div>
          </div>
          <div className="relative h-2 bg-muted/60 rounded-full overflow-hidden">
            <div
              className="absolute top-0 right-0 h-full bg-gradient-to-l from-primary to-primary/80 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${((currentStep + 1) / STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        الخطوة {currentStep + 1} من {STEPS.length}: {STEPS[currentStep]?.label}
      </div>
    </div>
  );
}

export { STEPS };
