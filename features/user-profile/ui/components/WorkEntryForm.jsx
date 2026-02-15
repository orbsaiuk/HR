"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { workEntrySchema, workEntryDefaults } from "../schemas/workEntrySchema";

/**
 * Inline form for adding/editing a single work experience entry.
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

    return (
        <form
            onSubmit={handleSubmit(onSave)}
            className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                    </label>
                    <input
                        {...register("title")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. Software Engineer"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company *
                    </label>
                    <input
                        {...register("company")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. Google"
                    />
                    {errors.company && (
                        <p className="text-xs text-red-600 mt-1">{errors.company.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                    </label>
                    <input
                        {...register("startDate")}
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                    {errors.startDate && (
                        <p className="text-xs text-red-600 mt-1">{errors.startDate.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        {...register("endDate")}
                        type="date"
                        disabled={isCurrent}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm disabled:opacity-50"
                    />
                </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                    {...register("isCurrent")}
                    type="checkbox"
                    className="rounded border-gray-300"
                />
                I currently work here
            </label>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="Describe your responsibilities and achievements..."
                />
            </div>

            <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" size="sm">
                    Save
                </Button>
            </div>
        </form>
    );
}
