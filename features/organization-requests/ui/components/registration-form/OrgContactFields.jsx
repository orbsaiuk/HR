"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">
                            Contact Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="contactEmail"
                            {...register("contactEmail")}
                            type="email"
                            placeholder="admin@yourcompany.com"
                        />
                        {errors.contactEmail && (
                            <p className="text-xs text-destructive">
                                {errors.contactEmail.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                            id="contactPhone"
                            {...register("contactPhone")}
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                        {errors.contactPhone && (
                            <p className="text-xs text-destructive">
                                {errors.contactPhone.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
