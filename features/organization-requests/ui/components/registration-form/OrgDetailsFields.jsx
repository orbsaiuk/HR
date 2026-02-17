"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
        control,
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
                <div className="space-y-2">
                    <Label htmlFor="orgLocation">Location</Label>
                    <Input
                        id="orgLocation"
                        {...register("orgLocation")}
                        placeholder="e.g. New York, NY, USA"
                    />
                    <p className="text-xs text-muted-foreground">
                        Headquarters or primary office location.
                    </p>
                    {errors.orgLocation && (
                        <p className="text-xs text-destructive">
                            {errors.orgLocation.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="orgWebsite">Website</Label>
                    <Input
                        id="orgWebsite"
                        {...register("orgWebsite")}
                        type="url"
                        placeholder="https://www.yourcompany.com"
                    />
                    {errors.orgWebsite && (
                        <p className="text-xs text-destructive">
                            {errors.orgWebsite.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Industry</Label>
                        <Controller
                            name="orgIndustry"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select industry..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INDUSTRY_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.orgIndustry && (
                            <p className="text-xs text-destructive">
                                {errors.orgIndustry.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Organization Size</Label>
                        <Controller
                            name="orgSize"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select size..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SIZE_OPTIONS.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.orgSize && (
                            <p className="text-xs text-destructive">
                                {errors.orgSize.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
