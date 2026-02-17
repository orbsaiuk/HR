"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { FormField } from "./FormField";

/**
 * Basic Information section — name, phone, headline, bio, location, dateOfBirth.
 * Uses shadcn Input, Textarea, and Label components.
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
                    <FormField label="Full Name" error={errors.name} required htmlFor="name">
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="Your full name"
                        />
                    </FormField>
                    <FormField label="Phone" error={errors.phone} htmlFor="phone">
                        <Input
                            id="phone"
                            {...register("phone")}
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                    </FormField>
                </div>

                <FormField label="Headline" error={errors.headline} htmlFor="headline">
                    <Input
                        id="headline"
                        {...register("headline")}
                        placeholder="e.g. Senior Software Engineer"
                    />
                </FormField>

                <FormField label="Bio" error={errors.bio} htmlFor="bio">
                    <Textarea
                        id="bio"
                        {...register("bio")}
                        rows={4}
                        placeholder="Tell us about yourself..."
                    />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Location" error={errors.location} htmlFor="location">
                        <Input
                            id="location"
                            {...register("location")}
                            placeholder="City, Country"
                        />
                    </FormField>
                    <FormField label="Date of Birth" error={errors.dateOfBirth} htmlFor="dateOfBirth">
                        <Input
                            id="dateOfBirth"
                            {...register("dateOfBirth")}
                            type="date"
                        />
                    </FormField>
                </div>
            </CardContent>
        </Card>
    );
}
