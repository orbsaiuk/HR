"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import { urlFor } from "@/shared/lib/sanityImage";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const INDUSTRY_OPTIONS = [
    { label: "تكنولوجيا المعلومات", value: "technology" },
    { label: "الرعاية الصحية", value: "healthcare" },
    { label: "الخدمات المالية", value: "finance" },
    { label: "التعليم", value: "education" },
    { label: "التجزئة", value: "retail" },
    { label: "التصنيع", value: "manufacturing" },
    { label: "الاستشارات", value: "consulting" },
    { label: "الإعلام والترفيه", value: "media" },
    { label: "غير ربحي", value: "nonprofit" },
    { label: "حكومي", value: "government" },
    { label: "أخرى", value: "other" },
];

const SIZE_OPTIONS = [
    { label: "1-10 موظفين", value: "1-10" },
    { label: "11-50 موظف", value: "11-50" },
    { label: "51-200 موظف", value: "51-200" },
    { label: "201-500 موظف", value: "201-500" },
    { label: "أكثر من 500 موظف", value: "500+" },
];

const headerSchema = z.object({
    name: z.string().min(2, "اسم الشركة يجب أن يكون حرفين على الأقل"),
    website: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
    industry: z.string().optional(),
    size: z.string().optional(),
    location: z.string().optional(),
    foundedYear: z.coerce.number().min(1900, "سنة غير صحيحة").max(new Date().getFullYear(), "سنة غير صحيحة").optional().or(z.literal("")),
});

/**
 * AlertDialog for editing company header info (name, website, industry, size, location, foundedYear).
 */
export function EditHeaderDialog({ open, onOpenChange, company, onSave, saving }) {
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoError, setLogoError] = useState(null);
    const fileInputRef = useRef(null);

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(headerSchema),
        defaultValues: {
            name: company?.name || "",
            website: company?.website || "",
            industry: company?.industry || "",
            size: company?.size || "",
            location: company?.location || "",
            foundedYear: company?.foundedYear || "",
        },
    });

    useEffect(() => {
        if (open && company) {
            reset({
                name: company.name || "",
                website: company.website || "",
                industry: company.industry || "",
                size: company.size || "",
                location: company.location || "",
                foundedYear: company.foundedYear || "",
            });
            setLogoFile(null);
            setLogoError(null);
            // Set preview from existing company logo
            if (company.logo) {
                setLogoPreview(urlFor(company.logo).width(200).height(200).url());
            } else {
                setLogoPreview(null);
            }
        }
    }, [open, company, reset]);

    const onSubmit = async (data) => {
        // Validate logo is present
        if (!logoPreview && !logoFile) {
            setLogoError("صورة الشعار مطلوبة");
            return;
        }
        setLogoError(null);

        const cleaned = { ...data };
        if (!cleaned.website) delete cleaned.website;
        if (!cleaned.foundedYear) {
            delete cleaned.foundedYear;
        } else {
            cleaned.foundedYear = Number(cleaned.foundedYear);
        }
        
        if (logoFile) {
            const reader = new FileReader();
            reader.readAsDataURL(logoFile);
            reader.onload = async () => {
                cleaned.logoBase64 = reader.result;
                await onSave(cleaned);
            };
        } else {
            await onSave(cleaned);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg" dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>تعديل معلومات الشركة</AlertDialogTitle>
                    <AlertDialogDescription>
                        قم بتحديث البيانات الأساسية للشركة.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Logo */}
                    <div className="space-y-2">
                        <Label>صورة الشعار *</Label>
                        <div className="flex items-center gap-4">
                            {/* Preview */}
                            <div className={`w-20 h-20 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted/30 shrink-0 ${logoError ? 'border-destructive' : 'border-muted-foreground/25'}`}>
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="معاينة الشعار"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ImageIcon size={28} className="text-muted-foreground/50" />
                                )}
                            </div>
                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload size={14} />
                                    {logoPreview ? "تغيير الشعار" : "رفع شعار"}
                                </Button>
                                {logoPreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => {
                                            setLogoFile(null);
                                            setLogoPreview(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                    >
                                        <X size={14} />
                                        إزالة
                                    </Button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setLogoFile(file);
                                        setLogoError(null);
                                        const reader = new FileReader();
                                        reader.onload = (ev) => setLogoPreview(ev.target.result);
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        {logoError && (
                            <p className="text-sm text-destructive font-medium">{logoError}</p>
                        )}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">اسم الشركة *</Label>
                        <Input id="edit-name" {...register("name")} />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Website */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-website">الموقع الإلكتروني</Label>
                        <Input id="edit-website" {...register("website")} placeholder="https://example.com" dir="ltr" />
                        {errors.website && (
                            <p className="text-sm text-destructive">{errors.website.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Industry */}
                        <div className="space-y-2">
                            <Label>المجال</Label>
                            <Controller
                                name="industry"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value || undefined} onValueChange={field.onChange} dir="rtl">
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر المجال" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {INDUSTRY_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {/* Size */}
                        <div className="space-y-2">
                            <Label>عدد الموظفين</Label>
                            <Controller
                                name="size"
                                control={control}
                                render={({ field }) => (
                                    <Select value={field.value || undefined} onValueChange={field.onChange} dir="rtl">
                                        <SelectTrigger>
                                            <SelectValue placeholder="اختر الحجم" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SIZE_OPTIONS.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-location">الموقع</Label>
                            <Input id="edit-location" {...register("location")} placeholder="مثال: القاهرة" />
                        </div>

                        {/* Founded Year */}
                        <div className="space-y-2">
                            <Label htmlFor="edit-foundedYear">تاريخ التأسيس</Label>
                            <Input id="edit-foundedYear" type="number" {...register("foundedYear")} placeholder="مثال: 2024" dir="ltr" />
                            {errors.foundedYear && (
                                <p className="text-sm text-destructive">{errors.foundedYear.message}</p>
                            )}
                        </div>
                    </div>

                    <AlertDialogFooter className="gap-2 pt-4">
                        <AlertDialogCancel disabled={saving}>إلغاء</AlertDialogCancel>
                        <AlertDialogAction type="submit" disabled={saving} onClick={(e) => { e.preventDefault(); handleSubmit(onSubmit)(); }}>
                            {saving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" />
                                    جاري الحفظ...
                                </span>
                            ) : (
                                "حفظ التغييرات"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
