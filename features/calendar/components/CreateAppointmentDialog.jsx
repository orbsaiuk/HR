"use client";

import { CalendarDays, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { CreateAppointmentForm } from "./CreateAppointmentForm";

export function CreateAppointmentDialog({ open, onOpenChange, onSubmit }) {
  function handleClose() {
    onOpenChange(false);
  }

  async function handleSubmit(data) {
    if (onSubmit) {
      await onSubmit(data);
    }
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-[520px] p-0 gap-0 overflow-hidden rounded-2xl border border-[#E6E8F0] bg-white shadow-[0_8px_40px_rgba(38,43,62,0.12)] [&>button:last-child]:hidden"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#F0F1F7]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EDE9FD] shrink-0">
                <CalendarDays className="w-5 h-5 text-[#5B4AE4]" />
              </div>
              <div className="text-start">
                <DialogTitle className="text-[17px] font-bold text-[#2F3646]">
                  إضافة موعد جديد
                </DialogTitle>
                <p className="text-xs text-[#9AA1B3] mt-0.5">
                  أدخل تفاصيل الموعد أو التذكير
                </p>
              </div>
            </div>
            <DialogClose asChild>
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#9AA1B3] hover:bg-[#F3F5FA] hover:text-[#4C556A] transition-colors"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        {/* Form Body & Footer via separate component */}
        <CreateAppointmentForm onSubmit={handleSubmit} onCancel={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
