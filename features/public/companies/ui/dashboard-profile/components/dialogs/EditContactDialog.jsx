"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
    twitter: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
    facebook: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
    linkedin: z.string().url("الرابط غير صحيح").optional().or(z.literal("")),
    email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
});

/**
 * AlertDialog for editing social/contact links.
 */
export function EditContactDialog({ open, onOpenChange, socialLinks, onSave, saving }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            twitter: socialLinks?.twitter || "",
            facebook: socialLinks?.facebook || "",
            linkedin: socialLinks?.linkedin || "",
            email: socialLinks?.email || "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                twitter: socialLinks?.twitter || "",
                facebook: socialLinks?.facebook || "",
                linkedin: socialLinks?.linkedin || "",
                email: socialLinks?.email || "",
            });
        }
    }, [open, socialLinks, reset]);

    const onSubmit = async (data) => {
        // Clean empty strings
        const cleaned = {};
        if (data.twitter?.trim()) cleaned.twitter = data.twitter.trim();
        if (data.facebook?.trim()) cleaned.facebook = data.facebook.trim();
        if (data.linkedin?.trim()) cleaned.linkedin = data.linkedin.trim();
        if (data.email?.trim()) cleaned.email = data.email.trim();
        await onSave({ socialLinks: cleaned });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-lg" dir="rtl">
                <AlertDialogHeader>
                    <AlertDialogTitle>تعديل معلومات التواصل</AlertDialogTitle>
                    <AlertDialogDescription>
                        أضف أو عدّل روابط التواصل الاجتماعي والبريد الإلكتروني.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-twitter">X</Label>
                        <Input id="edit-twitter" {...register("twitter")} placeholder="https://x.com/yourcompany" dir="ltr" />
                        {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-facebook">Facebook</Label>
                        <Input id="edit-facebook" {...register("facebook")} placeholder="https://facebook.com/yourcompany" dir="ltr" />
                        {errors.facebook && <p className="text-sm text-destructive">{errors.facebook.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-linkedin">LinkedIn</Label>
                        <Input id="edit-linkedin" {...register("linkedin")} placeholder="https://linkedin.com/company/yourcompany" dir="ltr" />
                        {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-email">البريد الإلكتروني</Label>
                        <Input id="edit-email" {...register("email")} placeholder="contact@company.com" dir="ltr" />
                        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
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
