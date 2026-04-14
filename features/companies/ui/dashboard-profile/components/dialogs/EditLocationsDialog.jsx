"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";

const locationsSchema = z.object({
    officeLocations: z.array(
        z.object({
            value: z.string().min(1, "الموقع مطلوب"),
        })
    ),
});

/**
 * AlertDialog for editing office locations.
 */
export function EditLocationsDialog({ open, onOpenChange, officeLocations = [], onSave, saving }) {
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(locationsSchema),
        defaultValues: {
            officeLocations: officeLocations.length > 0
                ? officeLocations.map((loc) => ({ value: loc }))
                : [{ value: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "officeLocations",
    });

    useEffect(() => {
        if (open) {
            reset({
                officeLocations: officeLocations.length > 0
                    ? officeLocations.map((loc) => ({ value: loc }))
                    : [{ value: "" }],
            });
        }
    }, [open, officeLocations, reset]);

    const onSubmit = async (data) => {
        const cleaned = data.officeLocations
            .map((loc) => loc.value?.trim())
            .filter(Boolean);
        await onSave({ officeLocations: cleaned });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-md" dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>تعديل مواقع المكاتب</AlertDialogTitle>
                    <AlertDialogDescription>
                        أضف أو عدّل مواقع مكاتب شركتك حول العالم.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <div className="flex-1 space-y-1">
                                <Input
                                    {...register(`officeLocations.${index}.value`)}
                                    placeholder="مثال: لندن، إنجلترا"
                                />
                                {errors.officeLocations?.[index]?.value && (
                                    <p className="text-xs text-destructive">
                                        {errors.officeLocations[index].value.message}
                                    </p>
                                )}
                            </div>
                            {fields.length > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                                    onClick={() => remove(index)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => append({ value: "" })}
                    >
                        <Plus size={14} className="ml-2" />
                        إضافة موقع
                    </Button>

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
