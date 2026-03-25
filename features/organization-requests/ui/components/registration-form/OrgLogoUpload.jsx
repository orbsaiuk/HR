"use client";

import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X, Check } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

/**
 * Enhanced organization logo upload with preview and better UX.
 * Must be used within a react-hook-form FormProvider.
 */
export function OrgLogoUpload() {
    const { setValue, watch, formState: { errors } } = useFormContext();
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Watch the orgLogo field to sync preview with form value (e.g., when restored from localStorage)
    const orgLogo = watch("orgLogo");

    useEffect(() => {
        if (orgLogo instanceof File && !preview) {
            // Generate preview for restored file
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(orgLogo);
        } else if (!orgLogo && preview) {
            // Clear preview if file was removed
            setPreview(null);
        }
    }, [orgLogo, preview]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return;
        }

        setValue("orgLogo", file, { shouldValidate: true });

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreview(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        setValue("orgLogo", null, { shouldValidate: true });
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024) {
            setValue("orgLogo", file, { shouldValidate: true });
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-3 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors">
            <Label className="text-base font-semibold flex items-center gap-2">
                <ImageIcon size={16} className="text-primary" />
                شعار المؤسسة <span className="text-destructive">*</span>
            </Label>

            <div
                className={`relative flex items-center gap-6 p-6 border-2 border-dashed rounded-xl transition-all ${
                    isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25"
                } ${preview ? "bg-muted/50" : "bg-background"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {preview ? (
                    <div className="relative group">
                        <div className="relative overflow-hidden rounded-xl ring-2 ring-primary/20">
                            <img
                                src={preview}
                                alt="معاينة الشعار"
                                className="w-24 h-24 object-contain bg-white"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="bg-white text-destructive rounded-full p-2 hover:bg-destructive hover:text-white transition-colors"
                                    aria-label="إزالة الشعار"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="absolute -top-2 -left-2 bg-green-500 text-white rounded-full p-1 shadow-lg">
                            <Check size={14} />
                        </div>
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center text-muted-foreground bg-muted/30 transition-all group-hover:border-primary group-hover:text-primary">
                        <ImageIcon size={32} />
                    </div>
                )}

                <div className="flex-1 space-y-3">
                    <div>
                        <p className="text-sm font-medium mb-1">
                            {preview ? "تم رفع الشعار بنجاح" : "قم برفع شعار مؤسستك"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, أو SVG. الحد الأقصى 2 ميجابايت.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={preview ? "outline" : "default"}
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="gap-2"
                        >
                            <Upload size={16} />
                            {preview ? "تغيير الشعار" : "اختيار ملف"}
                        </Button>
                        {preview && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleRemove}
                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <X size={16} />
                                إزالة
                            </Button>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="اختيار ملف الشعار"
                    />
                </div>
            </div>

            {!errors.orgLogo && (
                <p className="text-xs text-muted-foreground flex items-start gap-1.5 pr-2">
                    <span className="inline-block mt-0.5">💡</span>
                    <span>يمكنك سحب وإفلات الصورة مباشرة في المربع أعلاه</span>
                </p>
            )}
            {errors.orgLogo && (
                <p className="text-sm text-destructive font-medium" role="alert">
                    {errors.orgLogo.message}
                </p>
            )}
        </div>
    );
}
