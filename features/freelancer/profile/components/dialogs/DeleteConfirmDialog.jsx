"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "هل أنت متأكد؟",
  description = "لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.",
  onConfirm,
  isDeleting = false,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" hideCloseButton className="sm:max-w-[400px]">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="gap-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex-row items-center justify-center gap-3 sm:justify-center sm:space-x-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 rounded-xl"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "جارٍ الحذف..." : "نعم، احذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
