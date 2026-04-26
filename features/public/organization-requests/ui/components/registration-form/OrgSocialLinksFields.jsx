"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const SOCIAL_PLATFORMS = [
  {
    name: "facebook",
    label: "فيسبوك",
    icon: Facebook,
    placeholder: "https://facebook.com/company",
  },
  {
    name: "twitter",
    label: "تويتر (X)",
    icon: Twitter,
    placeholder: "https://twitter.com/company",
  },
  {
    name: "linkedin",
    label: "لينكدإن",
    icon: Linkedin,
    placeholder: "https://linkedin.com/company/name",
  },
  {
    name: "instagram",
    label: "إنستغرام",
    icon: Instagram,
    placeholder: "https://instagram.com/company",
  },
];

/**
 * Social media links input fields.
 * Part of Step 2: Social & Communication Details.
 */
export function OrgSocialLinksFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">حسابات التواصل الاجتماعي</Label>
        <p className="text-xs text-muted-foreground mt-1">
          أضف روابط حسابات مؤسستك على وسائل التواصل الاجتماعي (اختياري)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOCIAL_PLATFORMS.map(({ name, label, icon: Icon, placeholder }) => {
          const fieldName = `socialLinks.${name}`;
          const fieldError = errors.socialLinks?.[name];

          return (
            <div key={name} className="space-y-2">
              <Label htmlFor={fieldName} className="flex items-center gap-2">
                <Icon size={16} className="text-muted-foreground" />
                {label}
              </Label>
              <Input
                id={fieldName}
                type="url"
                {...register(fieldName)}
                placeholder={placeholder}
                dir="ltr"
                className="text-right"
                aria-invalid={fieldError ? "true" : "false"}
              />
              {fieldError && (
                <p className="text-xs text-destructive" role="alert">
                  {fieldError.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
