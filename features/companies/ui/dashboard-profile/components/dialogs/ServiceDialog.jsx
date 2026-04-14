"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { urlFor } from "@/shared/lib/sanityImage";

const serviceSchema = z.object({
    title: z.string().min(2, "العنوان مطلوب بحد أدنى حرفين"),
    description: z.string().max(500, "الوصف يجب أن يكون أقل من 500 حرف").optional().nullable(),
});

/**
 * Dialog for adding or editing a single service.
 */
export function ServiceDialog({ open, onOpenChange, service = null, onSave, saving }) {
    const isEditMode = !!service;

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            title: "",
            description: "",
        },
    });

    const descriptionText = watch("description") || "";

    const [imageState, setImageState] = useState({ file: null, preview: null, existing: null });
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Initialize state when open is true
    useEffect(() => {
        if (open) {
            if (service) {
                reset({
                    title: service.title || "",
                    description: service.description || "",
                });
                setImageState({
                    file: null,
                    preview: service.image ? urlFor(service.image).width(400).height(200).url() : null,
                    existing: service.image || null,
                });
            } else {
                reset({ title: "", description: "" });
                setImageState({ file: null, preview: null, existing: null });
            }
        }
    }, [open, service, reset]);

    const processFile = (file) => {
        if (!file || !file.type.startsWith("image/")) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            setImageState({ file, preview: ev.target.result, existing: null });
        };
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    const handleImageRemove = () => {
        setImageState({ file: null, preview: null, existing: null });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data) => {
        const resultData = {
            title: data.title.trim(),
            description: data.description?.trim() || "",
        };

        if (imageState.file) {
            resultData.imageBase64 = imageState.preview;
        } else if (imageState.existing) {
            resultData.image = imageState.existing;
        } else {
            resultData.removeImage = true; // Signal to remove image if needed
        }

        await onSave(resultData);
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>{isEditMode ? "تعديل الخدمة" : "إضافة خدمة جديدة"}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {isEditMode ? "قم بتعديل تفاصيل الخدمة الحالية." : "أضف تفاصيل الخدمة التي تقدمها شركتك."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <Label>صورة الخدمة (اختياري)</Label>
                        {!imageState.preview ? (
                            <div
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
                                }`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="bg-primary/10 p-3 rounded-full mb-3">
                                    <Upload className="w-5 h-5 text-primary" />
                                </div>
                                <p className="text-sm font-medium">اضغط أو اسحب الصورة هنا</p>
                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, أو WEBP (الحد الأقصى 2MB)</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-40 border rounded-xl overflow-hidden group">
                                <img
                                    src={imageState.preview}
                                    alt="معاينة الصورة"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        تغيير
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleImageRemove}
                                    >
                                        إزالة
                                    </Button>
                                </div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2">
                        <Label htmlFor="title">عنوان الخدمة *</Label>
                        <Input
                            id="title"
                            {...register("title")}
                            placeholder="مثال: تصميم وتطوير المواقع"
                            className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive font-medium">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="description">وصف الخدمة</Label>
                            <span className="text-xs text-muted-foreground">
                                {descriptionText.length}/500
                            </span>
                        </div>
                        <Textarea
                            id="description"
                            {...register("description")}
                            rows={4}
                            className={`resize-none ${errors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            placeholder="اكتب وصفاً مختصراً للخدمة، الميزات التي تقدمها، وهدفها..."
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                        <AlertDialogCancel
                            type="button"
                            onClick={() => {
                                onOpenChange(false);
                            }}
                            disabled={saving}
                        >
                            إلغاء
                        </AlertDialogCancel>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                isEditMode ? "حفظ التعديلات" : "إضافة الخدمة"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}

