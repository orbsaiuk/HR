"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Globe,
  FileText,
  Mail,
  Phone,
  MapPin,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Pencil,
} from "lucide-react";
/* eslint-disable @next/next/no-img-element */

const INDUSTRY_LABELS = {
  technology: "تكنولوجيا المعلومات",
  healthcare: "الرعاية الصحية",
  finance: "الخدمات المالية",
  education: "التعليم",
  retail: "التجزئة",
  manufacturing: "التصنيع",
  consulting: "الاستشارات",
  media: "الإعلام والترفيه",
  nonprofit: "غير ربحي",
  government: "حكومي",
  other: "أخرى",
};

const SIZE_LABELS = {
  "1-10": "1-10 موظفين",
  "11-50": "11-50 موظف",
  "51-200": "51-200 موظف",
  "201-500": "201-500 موظف",
  "500+": "أكثر من 500 موظف",
};

const SOCIAL_ICONS = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
};

/**
 * Step 4: Review & Submit
 * Displays a summary of all entered data for final review before submission.
 */
export function Step4Review({ onEditStep }) {
  const { watch } = useFormContext();
  const formData = watch();

  const {
    orgName,
    orgSize,
    orgIndustry,
    orgLogo,
    orgDescription,
    contactEmail,
    orgWebsite,
    contactPhone,
    socialLinks,
    address,
    registrationNumber,
    taxId,
  } = formData;

  // Create preview URL for logo if it's a File
  const logoPreview =
    orgLogo instanceof File ? URL.createObjectURL(orgLogo) : null;

  const hasSocialLinks =
    socialLinks && Object.values(socialLinks).some((v) => v);
  const hasLegalInfo = registrationNumber || taxId;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">مراجعة البيانات</h2>
        <p className="text-sm text-muted-foreground">
          تأكد من صحة البيانات قبل إرسال الطلب
        </p>
      </div>

      {/* Section 1: Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Building2 size={18} className="text-primary" />
              البيانات الأساسية
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(0)}
              className="gap-2"
            >
              <Pencil size={14} />
              تعديل
            </Button>
          </div>

          <div className="space-y-4">
            {/* Logo and Name */}
            <div className="flex items-start gap-4">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg object-contain border"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground">
                  <Building2 size={24} />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{orgName || "-"}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {orgIndustry && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {INDUSTRY_LABELS[orgIndustry] || orgIndustry}
                    </span>
                  )}
                  {orgSize && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      {SIZE_LABELS[orgSize] || orgSize}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {orgDescription && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">الوصف</p>
                <p className="text-sm">{orgDescription}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Contact Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <Globe size={18} className="text-primary" />
              بيانات التواصل
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              className="gap-2"
            >
              <Pencil size={14} />
              تعديل
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              <span className="text-sm" dir="ltr">
                {contactEmail || "-"}
              </span>
            </div>
            {contactPhone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-muted-foreground" />
                <span className="text-sm" dir="ltr">
                  {contactPhone}
                </span>
              </div>
            )}
            {orgWebsite && (
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-muted-foreground" />
                <span className="text-sm truncate" dir="ltr">
                  {orgWebsite}
                </span>
              </div>
            )}
            <div className="flex items-start gap-2 sm:col-span-2">
              <MapPin
                size={16}
                className="text-muted-foreground shrink-0 mt-0.5"
              />
              <span className="text-sm">{address || "-"}</span>
            </div>
          </div>

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">
                حسابات التواصل الاجتماعي
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = SOCIAL_ICONS[platform];
                  return (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded hover:bg-muted/80"
                    >
                      <Icon size={14} />
                      <span className="capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Legal Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              المعلومات القانونية
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              className="gap-2"
            >
              <Pencil size={14} />
              تعديل
            </Button>
          </div>

          {hasLegalInfo ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {registrationNumber && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    رقم السجل التجاري
                  </p>
                  <p className="text-sm font-medium" dir="ltr">
                    {registrationNumber}
                  </p>
                </div>
              )}
              {taxId && (
                <div>
                  <p className="text-xs text-muted-foreground">الرقم الضريبي</p>
                  <p className="text-sm font-medium" dir="ltr">
                    {taxId}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              لم يتم إدخال معلومات قانونية (اختياري)
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
