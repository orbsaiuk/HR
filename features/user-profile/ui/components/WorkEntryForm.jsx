"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { workEntrySchema, workEntryDefaults } from "../schemas/workEntrySchema";

/**
 * Inline form for adding/editing a single work experience entry.
 * Uses a <div> instead of <form> to avoid nested form submission
 * which would trigger the parent profile form.
 */
export function WorkEntryForm({ entry = {}, onSave, onCancel }) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(workEntrySchema),
        defaultValues: entry?._key ? { ...entry } : workEntryDefaults,
    });

    const isCurrent = watch("isCurrent");

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
                    <Label htmlFor="work-title">
                        Job Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="work-title"
                        {...register("title")}
                        placeholder="e.g. Software Engineer"
                    />
                    {errors.title && (
                        <p className="text-xs text-destructive">{errors.title.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="work-company">
                        Company <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="work-company"
                        {...register("company")}
                        placeholder="e.g. Google"
                    />
                    {errors.company && (
                        <p className="text-xs text-destructive">{errors.company.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="work-start">
                        Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="work-start"
                        {...register("startDate")}
                        type="date"
                    />
                    {errors.startDate && (
                        <p className="text-xs text-destructive">{errors.startDate.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="work-end">End Date</Label>
                    <Input
                        id="work-end"
                        {...register("endDate")}
                        type="date"
                        disabled={isCurrent}
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                    {...register("isCurrent")}
                    type="checkbox"
                    className="rounded border-input h-4 w-4"
                />
                I currently work here
            </label>

            <div className="space-y-1.5">
                <Label htmlFor="work-desc">Description</Label>
                <Textarea
                    id="work-desc"
                    {...register("description")}
                    rows={3}
                    placeholder="Describe your responsibilities and achievements..."
                />
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
