"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const bioSchema = z.object({
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل").max(1000, "الوصف يجب ألا يتجاوز 1000 حرف"),
});

/**
 * AlertDialog for editing company bio/description.
 */
export function EditBioDialog({ open, onOpenChange, description, onSave, saving }) {
    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(bioSchema),
        defaultValues: {
            description: description || "",
        },
    });

    const currentDescription = watch("description") || "";

    useEffect(() => {
        if (open) {
            reset({ description: description || "" });
        }
    }, [open, description, reset]);

    const onSubmit = async (data) => {
        await onSave({ description: data.description });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg" dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>تعديل معلومات الشركة</AlertDialogTitle>
                    <AlertDialogDescription>
                        قم بتحديث وصف الشركة.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="edit-description">وصف الشركة *</Label>
                            <span className={`text-xs ${currentDescription.length > 1000 ? "text-destructive" : "text-muted-foreground"}`}>
                                {currentDescription.length} / 1000
                            </span>
                        </div>
                        <Textarea
                            id="edit-description"
                            {...register("description")}
                            rows={6}
                            className="resize-none"
                            placeholder="اكتب وصفاً شاملاً عن شركتك..."
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <AlertDialogFooter className="gap-2 pt-4">
                        <AlertDialogCancel disabled={saving}>إلغاء</AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={saving} onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }}>
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    جاري الحفظ...
                                </span>
                            ) : (
                                "حفظ التغييرات"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
