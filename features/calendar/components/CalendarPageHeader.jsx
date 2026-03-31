"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";

export function CalendarPageHeader() {
  const [open, setOpen] = useState(false);

  function handleSubmit(data) {
    // TODO: replace with actual API call / state update
    console.log("New appointment:", data);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2F3646] mb-1">
            التقويم والتذكيرات
          </h1>
          <p className="text-sm text-[#8A90A2]">تابع مواعيدك ومهامك القادمة</p>
        </div>

        <Button
          id="open-create-appointment"
          onClick={() => setOpen(true)}
          className="bg-[#5338D5] hover:bg-[#462EA8] text-white gap-2 rounded-md px-5 py-5 font-semibold text-sm shadow-[0_2px_8px_rgba(83,56,213,0.25)]"
        >
          إضافة تذكير
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <CreateAppointmentDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </>
  );
}