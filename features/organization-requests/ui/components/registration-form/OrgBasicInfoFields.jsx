"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

/**
 * Organization basic info fields — name, slug, description.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgBasicInfoFields() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 size={18} />
                    Organization Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register("orgName")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. Acme Corporation"
                    />
                    {errors.orgName && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.orgName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Slug
                    </label>
                    <input
                        {...register("orgSlug")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. acme-corporation"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        URL-friendly identifier. Leave blank to auto-generate from name.
                    </p>
                    {errors.orgSlug && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.orgSlug.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("orgDescription")}
                        rows={3}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Brief description of your organization..."
                    />
                    {errors.orgDescription && (
                        <p className="text-xs text-red-600 mt-1">
                            {errors.orgDescription.message}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
