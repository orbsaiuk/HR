"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link as LinkIcon } from "lucide-react";
import { FormField } from "./FormField";

/**
 * Social Links section — LinkedIn, GitHub, Portfolio URLs.
 * Must be used within a react-hook-form FormProvider.
 */
export function SocialLinksSection() {
    const { register, formState: { errors } } = useFormContext();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <LinkIcon size={18} />
                    Social Links
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField label="LinkedIn URL" error={errors.linkedinUrl}>
                    <input
                        {...register("linkedinUrl")}
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="https://linkedin.com/in/..."
                    />
                </FormField>
                <FormField label="GitHub URL" error={errors.githubUrl}>
                    <input
                        {...register("githubUrl")}
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="https://github.com/..."
                    />
                </FormField>
                <FormField label="Portfolio URL" error={errors.portfolioUrl}>
                    <input
                        {...register("portfolioUrl")}
                        type="url"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="https://yourportfolio.com"
                    />
                </FormField>
            </CardContent>
        </Card>
    );
}
