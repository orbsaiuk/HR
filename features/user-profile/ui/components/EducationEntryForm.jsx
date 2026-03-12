"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { educationEntrySchema, educationEntryDefaults } from "../schemas/educationEntrySchema";

/**
 * Inline form for adding/editing a single education entry.
 * Uses a <div> instead of <form> to avoid nested form submission
 * which would trigger the parent profile form.
 */
export function EducationEntryForm({ entry = {}, onSave, onCancel }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(educationEntrySchema),
        defaultValues: entry?._key ? { ...entry } : educationEntryDefaults,
    });

    const onInternalSubmit = (e) => {
        // Prevent the event from reaching the parent <form>
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSave)(e);
    };

    return (
        <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="edu-institution">
                        المؤسسة التعليمية <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="edu-institution"
                        {...register("institution")}
                        placeholder="مثال: جامعة القاهرة"
                    />
                    {errors.institution && (
                        <p className="text-xs text-destructive">{errors.institution.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-degree">
                        الدرجة العلمية <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="edu-degree"
                        {...register("degree")}
                        placeholder="مثال: بكالوريوس علوم"
                    />
                    {errors.degree && (
                        <p className="text-xs text-destructive">{errors.degree.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="edu-field">التخصص</Label>
                <Input
                    id="edu-field"
                    {...register("fieldOfStudy")}
                    placeholder="مثال: علوم الحاسب"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="edu-start">تاريخ البداية</Label>
                    <Input
                        id="edu-start"
                        {...register("startDate")}
                        type="date"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-end">تاريخ النهاية</Label>
                    <Input
                        id="edu-end"
                        {...register("endDate")}
                        type="date"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-grade">المعدل التراكمي</Label>
                    <Input
                        id="edu-grade"
                        {...register("grade")}
                        placeholder="مثال: 3.8"
                    />
                </div>
            </div>

            <div className="flex justify-start gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    إلغاء
                </Button>
                <Button type="button" size="sm" onClick={onInternalSubmit}>
                    حفظ
                </Button>
            </div>
        </div>
    );
}
