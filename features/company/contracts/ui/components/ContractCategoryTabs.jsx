"use client";

import { Button } from "@/components/ui/button";

export function ContractCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" dir="rtl">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <Button
            key={category}
            type="button"
            variant="outline"
            onClick={() => onCategoryChange(category)}
            className={[
              "h-8 rounded-full border px-4 text-xs font-medium",
              isActive
                ? "border-[#5338D5] bg-[#5338D5] text-white hover:bg-[#462EA8] hover:text-white"
                : "border-[#C7CFDF] bg-white text-[#7A8397] hover:bg-[#F7F8FC]",
            ].join(" ")}
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
}
