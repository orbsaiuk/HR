"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { educationEntrySchema, educationEntryDefaults } from "../schemas/educationEntrySchema";

/**
 * Inline form for adding/editing a single education entry.
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

    return (
        <form
            onSubmit={handleSubmit(onSave)}
            className="space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Institution *
                    </label>
                    <input
                        {...register("institution")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. MIT"
                    />
                    {errors.institution && (
                        <p className="text-xs text-red-600 mt-1">{errors.institution.message}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Degree *
                    </label>
                    <input
                        {...register("degree")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. Bachelor of Science"
                    />
                    {errors.degree && (
                        <p className="text-xs text-red-600 mt-1">{errors.degree.message}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study
                </label>
                <input
                    {...register("fieldOfStudy")}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="e.g. Computer Science"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                    </label>
                    <input
                        {...register("startDate")}
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                    </label>
                    <input
                        {...register("endDate")}
                        type="date"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grade / GPA
                    </label>
                    <input
                        {...register("grade")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. 3.8"
                    />
                </div>
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
