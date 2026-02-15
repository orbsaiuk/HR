"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { FormField } from "./FormField";

/**
 * Basic Information section — name, phone, headline, bio, location, dateOfBirth.
 * Must be used within a react-hook-form FormProvider.
 */
export function BasicInfoSection() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <User size={18} />
                    Basic Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Full Name" error={errors.name} required>
                        <input
                            {...register("name")}
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                    </FormField>
                    <FormField label="Phone" error={errors.phone}>
                        <input
                            {...register("phone")}
                            type="tel"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="+1 (555) 123-4567"
                        />
                    </FormField>
                </div>

                <FormField label="Headline" error={errors.headline}>
                    <input
                        {...register("headline")}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="e.g. Senior Software Engineer"
                    />
                </FormField>

                <FormField label="Bio" error={errors.bio}>
                    <textarea
                        {...register("bio")}
                        rows={4}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Tell us about yourself..."
                    />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Location" error={errors.location}>
                        <input
                            {...register("location")}
                            type="text"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            placeholder="City, Country"
                        />
                    </FormField>
                    <FormField label="Date of Birth" error={errors.dateOfBirth}>
                        <input
                            {...register("dateOfBirth")}
                            type="date"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                    </FormField>
                </div>
            </CardContent>
        </Card>
    );
}
