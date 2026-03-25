"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OrgSocialLinksFields } from "../OrgSocialLinksFields";

/**
 * Step 2: Social & Communication Details
 * Fields: contactEmail*, orgWebsite, contactPhone, socialLinks, address*
 */
export function Step2SocialContact() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">بيانات التواصل والوسائط</h2>
        <p className="text-sm text-muted-foreground">
          أدخل معلومات التواصل والحسابات الاجتماعية
        </p>
      </div>

      <div className="space-y-4">
        {/* Contact Email */}
        <div className="space-y-2">
          <Label htmlFor="contactEmail">
            البريد الإلكتروني للتواصل{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactEmail"
            type="email"
            {...register("contactEmail")}
            placeholder="contact@company.com"
            aria-describedby={
              errors.contactEmail ? "contactEmail-error" : undefined
            }
            aria-invalid={errors.contactEmail ? "true" : "false"}
          />
          {errors.contactEmail && (
            <p
              id="contactEmail-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.contactEmail.message}
            </p>
          )}
        </div>

        {/* Website and Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="orgWebsite">الموقع الإلكتروني</Label>
            <Input
              id="orgWebsite"
              type="url"
              {...register("orgWebsite")}
              placeholder="https://www.company.com"
              dir="ltr"
              className="text-right"
              aria-describedby={
                errors.orgWebsite ? "orgWebsite-error" : undefined
              }
              aria-invalid={errors.orgWebsite ? "true" : "false"}
            />
            {errors.orgWebsite && (
              <p
                id="orgWebsite-error"
                className="text-xs text-destructive"
                role="alert"
              >
                {errors.orgWebsite.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">رقم الهاتف</Label>
            <Input
              id="contactPhone"
              type="tel"
              {...register("contactPhone")}
              placeholder="+966 5X XXX XXXX"
              dir="ltr"
              className="text-right"
            />
            {errors.contactPhone && (
              <p className="text-xs text-destructive" role="alert">
                {errors.contactPhone.message}
              </p>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <OrgSocialLinksFields />

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address">
            العنوان <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            {...register("address")}
            rows={3}
            placeholder="المدينة، الحي، الشارع، رقم المبنى..."
            aria-describedby={errors.address ? "address-error" : undefined}
            aria-invalid={errors.address ? "true" : "false"}
          />
          {errors.address && (
            <p
              id="address-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.address.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
