import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function FreelancerCalendarHeader({ onAddReminder }) {
  return (
    <header className="mb-8 flex flex-col gap-4 text-right md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#2F3646] md:text-3xl">
          التقويم والتذكيرات
        </h1>
        <p className="mt-1 text-sm text-[#8A90A2]">
          تابع مواعيد تسليم المشاريع وتذكيراتك اليومية في مكان واحد
        </p>
      </div>

      <Button
        type="button"
        onClick={onAddReminder}
        className="h-11 gap-2 self-start rounded-md bg-[#5B4AE4] px-5 text-sm font-semibold text-white shadow-[0_2px_8px_rgba(91,74,228,0.25)] hover:bg-[#4A3BC0]"
      >
        إضافة تذكير
        <Plus className="h-5 w-5" />
      </Button>
    </header>
  );
}
