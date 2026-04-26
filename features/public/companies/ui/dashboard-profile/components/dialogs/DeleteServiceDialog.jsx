"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";

export function DeleteServiceDialog({
    open,
    onOpenChange,
    onConfirm,
    saving,
    title,
}) {
    return (
        <AlertDialog open={open} onOpenChange={!saving ? onOpenChange : undefined}>
            <AlertDialogContent className="sm:max-w-md rounded-2xl p-6" dir="rtl">
                
                {/* Header */}
                <AlertDialogHeader className="text-right space-y-3">
                    
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-500" />
                        </div>

                        <AlertDialogTitle className="text-lg font-bold text-red-600">
                            حذف الخدمة
                        </AlertDialogTitle>
                    </div>

                    <AlertDialogDescription className="leading-relaxed text-muted-foreground flex">
                        أنت على وشك حذف خدمة:
                        <span className="font-semibold text-foreground">
                            {title}
                        </span>
                    </AlertDialogDescription>

                </AlertDialogHeader>

                {/* Footer */}
                <AlertDialogFooter className="mt-6 flex flex-col sm:flex-row-reverse gap-2">
                    
                    {/* Delete */}
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            onConfirm();
                        }}
                        disabled={saving}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الحذف...
                            </span>
                        ) : (
                            "تأكيد الحذف"
                        )}
                    </AlertDialogAction>

                    {/* Cancel */}
                    <AlertDialogCancel
                        disabled={saving}
                        className="w-full sm:w-auto"
                    >
                        إلغاء
                    </AlertDialogCancel>

                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
