"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

/**
 * Contact information fields — email, phone.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgContactFields() {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail size={18} />
                    Contact Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register("contactEmail")}
                            type="email"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="admin@yourcompany.com"
                        />
                        {errors.contactEmail && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.contactEmail.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contact Phone
                        </label>
                        <input
                            {...register("contactPhone")}
                            type="tel"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.contactPhone && (
                            <p className="text-xs text-red-600 mt-1">
                                {errors.contactPhone.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
