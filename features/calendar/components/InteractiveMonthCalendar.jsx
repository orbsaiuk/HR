"use client";

import { Calendar } from "@/components/ui/calendar";
import { ar } from "date-fns/locale";

export function InteractiveMonthCalendar({ date, setDate }) {
  return (
    <div className="rounded-2xl bg-[#F7F7F9] p-1 md:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={ar}
        className="w-full"
        showOutsideDays={true}
        fixedWeeks={false}
        formatters={{
          formatCaption: (month) =>
            month.toLocaleString(ar.code, { month: "long" }),
          formatDay: (day) => day.getDate().toString().padStart(2, "0"),
          formatWeekdayName: (weekday) => {
            const arabicDays = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
            return arabicDays[weekday.getDay()];
          },
        }}
        classNames={{
          root: "w-full",
          months: "w-full flex-col relative",
          month: "w-full flex flex-col gap-4",
          month_caption: "flex items-center mb-5 h-8 relative w-full pr-1",
          caption_label:
            "text-lg font-semibold text-[#2F3646] tracking-wide",
          // Force LTR on nav container to keep arrows [prev, next] matched to image logic
          nav: "absolute left-2 top-0 flex flex-row items-center gap-1 z-20 [direction:ltr]", 
          button_previous:
            "inline-flex items-center justify-center h-8 w-8 rounded-md border-0 bg-transparent text-[#6D7488] opacity-70 hover:opacity-100 hover:bg-white transition-all cursor-pointer [&_svg]:!rotate-0", 
          button_next:
            "inline-flex items-center justify-center h-8 w-8 rounded-md border-0 bg-transparent text-[#6D7488] opacity-70 hover:opacity-100 hover:bg-white transition-all cursor-pointer [&_svg]:!rotate-0", 
          table: "w-full border-collapse mt-1",
          weekdays: "flex w-full justify-between mb-2 px-0",
          weekday:
            "text-[#9CA3B4] font-medium text-[13px] flex-1 text-center select-none",
          week: "flex w-full justify-between mt-1",
          day: "flex-1 h-10 text-center p-0 relative",
          day_button:
            "h-10 w-10 mx-auto p-0 font-medium text-[14px] text-[#3D4457] rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-white data-[selected-single=true]:bg-[#5B4AE4] data-[selected-single=true]:text-white data-[selected-single=true]:font-semibold data-[selected-single=true]:shadow-[0_2px_8px_rgba(91,74,228,0.35)]",
          today: "text-[#5B4AE4] font-semibold",
          outside: "text-[#C8CCD8] pointer-events-none",
          hidden: "invisible",
          disabled: "text-[#C8CCD8] opacity-50",
        }}
      />
    </div>
  );
}
