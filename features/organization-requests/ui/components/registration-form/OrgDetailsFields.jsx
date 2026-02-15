"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

const INDUSTRY_OPTIONS = [
    { label: "Technology", value: "technology" },
    { label: "Healthcare", value: "healthcare" },
    { label: "Finance", value: "finance" },
    { label: "Education", value: "education" },
    { label: "Retail", value: "retail" },
    { label: "Manufacturing", value: "manufacturing" },
    { label: "Consulting", value: "consulting" },
    { label: "Media & Entertainment", value: "media" },
    { label: "Non-Profit", value: "nonprofit" },
    { label: "Government", value: "government" },
    { label: "Other", value: "other" },
];

const SIZE_OPTIONS = [
    { label: "1-10 employees", value: "1-10" },
    { label: "11-50 employees", value: "11-50" },
    { label: "51-200 employees", value: "51-200" },
    { label: "201-500 employees", value: "201-500" },
    { label: "500+ employees", value: "500+" },
];

/**
 * Organization details fields — website, industry, size.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgDetailsFields() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings size={18} />
                    Organization Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                    </label>
                    <input
                        {...register("orgWebsite")}
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="https://www.yourcompany.com"
                    />
                    {errors.orgWebsite && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.orgWebsite.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Industry
                        </label>
                        <select
                            {...register("orgIndustry")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                        >
                            <option value="">Select industry...</option>
                            {INDUSTRY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.orgIndustry && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.orgIndustry.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Organization Size
                        </label>
                        <select
                            {...register("orgSize")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                        >
                            <option value="">Select size...</option>
                            {SIZE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.orgSize && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.orgSize.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
