"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

/**
 * Organization basic info fields — name, description.
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
                <div className="space-y-2">
                    <Label htmlFor="orgName">
                        Organization Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="orgName"
                        {...register("orgName")}
                        placeholder="e.g. Acme Corporation"
                    />
                    {errors.orgName && (
                        <p className="text-xs text-destructive">
                            {errors.orgName.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="orgDescription">Description</Label>
                    <Textarea
                        id="orgDescription"
                        {...register("orgDescription")}
                        rows={3}
                        placeholder="Brief description of your organization..."
                    />
                    {errors.orgDescription && (
                        <p className="text-xs text-destructive">
                            {errors.orgDescription.message}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
