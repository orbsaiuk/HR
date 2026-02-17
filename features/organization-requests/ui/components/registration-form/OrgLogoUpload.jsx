"use client";

import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

/**
 * Organization logo upload with preview.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgLogoUpload() {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return;
        }

        setValue("orgLogo", file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setValue("orgLogo", null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon size={18} />
                    Organization Logo
                    <span className="text-destructive">*</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-6">
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Logo preview"
                                className="w-20 h-20 rounded-lg object-contain border"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 hover:bg-destructive/90"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ) : (
                        <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center text-muted-foreground">
                            <ImageIcon size={24} />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload size={16} className="mr-2" />
                            {preview ? "Change Logo" : "Upload Logo"}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, or SVG. Max 2MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>
                {errors.orgLogo && (
                    <p className="text-sm text-destructive mt-2">
                        {errors.orgLogo.message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
