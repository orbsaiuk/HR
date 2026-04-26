"use client";

import { Checkbox } from "@/components/ui/checkbox";

export function FilterCheckboxList({ options, selectedValues, onToggle }) {
  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isChecked = selectedValues.includes(option.value);
        return (
          <div
            key={option.value}
            className="group flex cursor-pointer items-center justify-between"
            onClick={() => onToggle(option.value)}
          >
            <div className="flex items-center gap-2.5">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => onToggle(option.value)}
                className="data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600"
                onClick={(event) => event.stopPropagation()}
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
            </div>
            {option.count !== undefined && (
              <span className="text-xs text-gray-400">({option.count})</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
