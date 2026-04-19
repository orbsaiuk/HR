"use client";

export function ContractStepper({ steps, currentStep }) {
  return (
    <div
      className="flex flex-wrap items-center justify-start gap-1.5 sm:gap-2"
      dir="rtl"
    >
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <span
            key={step.id}
            className={[
              "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium leading-5 transition-colors sm:px-3 sm:text-xs",
              isActive
                ? "border-[#5338D5] bg-[#5338D5] text-white"
                : isCompleted
                  ? "border-[#C9BFFF] bg-[#F3EFFF] text-[#5338D5]"
                  : "border-[#D3DAE8] bg-white text-[#8993A7]",
            ].join(" ")}
          >
            {step.label}
          </span>
        );
      })}
    </div>
  );
}
