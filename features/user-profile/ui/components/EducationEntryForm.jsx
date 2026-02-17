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
                        Institution <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="edu-institution"
                        {...register("institution")}
                        placeholder="e.g. MIT"
                    />
                    {errors.institution && (
                        <p className="text-xs text-destructive">{errors.institution.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-degree">
                        Degree <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="edu-degree"
                        {...register("degree")}
                        placeholder="e.g. Bachelor of Science"
                    />
                    {errors.degree && (
                        <p className="text-xs text-destructive">{errors.degree.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="edu-field">Field of Study</Label>
                <Input
                    id="edu-field"
                    {...register("fieldOfStudy")}
                    placeholder="e.g. Computer Science"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="edu-start">Start Date</Label>
                    <Input
                        id="edu-start"
                        {...register("startDate")}
                        type="date"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-end">End Date</Label>
                    <Input
                        id="edu-end"
                        {...register("endDate")}
                        type="date"
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="edu-grade">Grade / GPA</Label>
                    <Input
                        id="edu-grade"
                        {...register("grade")}
                        placeholder="e.g. 3.8"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="button" size="sm" onClick={onInternalSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
}
