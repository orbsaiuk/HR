"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Linkedin, Github, Globe } from "lucide-react";
import { FormField } from "./FormField";

/**
 * Social Links section — LinkedIn, GitHub, Portfolio URLs.
 * Uses shadcn Input and Label components.
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
                <FormField label="LinkedIn URL" error={errors.linkedinUrl} htmlFor="linkedinUrl">
                    <div className="relative">
                        <Linkedin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="linkedinUrl"
                            {...register("linkedinUrl")}
                            type="url"
                            className="pl-9"
                            placeholder="https://linkedin.com/in/..."
                        />
                    </div>
                </FormField>
                <FormField label="GitHub URL" error={errors.githubUrl} htmlFor="githubUrl">
                    <div className="relative">
                        <Github size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="githubUrl"
                            {...register("githubUrl")}
                            type="url"
                            className="pl-9"
                            placeholder="https://github.com/..."
                        />
                    </div>
                </FormField>
                <FormField label="Portfolio URL" error={errors.portfolioUrl} htmlFor="portfolioUrl">
                    <div className="relative">
                        <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="portfolioUrl"
                            {...register("portfolioUrl")}
                            type="url"
                            className="pl-9"
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </FormField>
            </CardContent>
        </Card>
    );
}
