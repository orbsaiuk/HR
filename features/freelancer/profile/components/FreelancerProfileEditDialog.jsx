"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AboutEditorSection } from "./AboutEditorSection";
import { DetailsEditorSection } from "./DetailsEditorSection";
import { freelancerProfileEditSchema } from "../ui/schemas";
import { HeaderEditorSection } from "./HeaderEditorSection";
import { PortfolioEditorSection } from "./PortfolioEditorSection";
import { ServicesEditorSection } from "./ServicesEditorSection";
import { SkillsEditorSection } from "./SkillsEditorSection";
import { SocialEditorSection } from "./SocialEditorSection";

const MAX_PORTFOLIO_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_PORTFOLIO_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

function normalizeTags(values = []) {
  const seen = new Set();
  return values
    .map((value) => String(value || "").trim())
    .filter((value) => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getSectionMeta(section) {
  const map = {
    header: {
      title: "تعديل معلومات الملف الشخصي",
      description: "قم بتحديث الاسم والعنوان والموقع الظاهر في أعلى الصفحة.",
    },
    about: {
      title: "تعديل نبذة عني",
      description: "اكتب وصفا مختصرا عن خبرتك وما تقدمه للعملاء.",
    },
    details: {
      title: "تعديل التفاصيل الإضافية",
      description: "حدث رقم الهاتف واللغات التي تتقنها.",
    },
    social: {
      title: "تعديل روابط التواصل",
      description:
        "أضف روابط حساباتك على المنصات المختلفة لتسهيل تواصل العملاء معك.",
    },
    skills: {
      title: "تعديل المهارات",
      description:
        "أضف المهارات كوسوم واضحة بدلا من كتابة قائمة مفصولة بفواصل.",
    },
    services: {
      title: "تعديل الخدمات",
      description:
        "أضف الخدمات التي تقدمها مع سعر ومدة تسليم يساعدان العميل على اتخاذ القرار.",
    },
    portfolio: {
      title: "تعديل معرض الأعمال",
      description: "أضف أعمالك السابقة وروابطها وصور العرض لتعزيز ثقة العملاء.",
    },
  };

  return (
    map[section] || {
      title: "تعديل",
      description: "قم بتحديث بيانات هذا القسم.",
    }
  );
}

function createDefaultValues(profile) {
  return {
    name: profile?.name || "",
    headline: profile?.headline || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    phone: profile?.phone || "",
    languages: normalizeTags(profile?.languages || []),
    skills: normalizeTags(profile?.skills || []),
    linkedinUrl: profile?.linkedinUrl || "",
    githubUrl: profile?.githubUrl || "",
    instagramUrl: profile?.instagramUrl || "",
    twitterUrl: profile?.twitterUrl || "",
    websiteUrl: profile?.websiteUrl || "",
    services: (profile?.services || []).map((entry) => ({
      _key: entry._key,
      title: entry.title || "",
      description: entry.description || "",
      price: entry.price ?? "",
      deliveryTime: entry.deliveryTime || "",
    })),
    portfolioProjects: (profile?.portfolioProjects || []).map((entry) => ({
      _key: entry._key,
      title: entry.title || "",
      link: entry.link || "",
      image: entry.image,
      imageUrl: entry.imageUrl || "",
      fieldId: "",
    })),
  };
}

async function buildSubmitPayload({
  section,
  values,
  portfolioFilesById,
  onUploadPortfolioImage,
}) {
  if (section === "header") {
    return {
      name: values.name.trim(),
      headline: values.headline.trim(),
      location: values.location.trim(),
    };
  }

  if (section === "about") {
    return { bio: values.bio.trim() };
  }

  if (section === "details") {
    return {
      phone: values.phone.trim(),
      languages: normalizeTags(values.languages),
    };
  }

  if (section === "social") {
    return {
      linkedinUrl: values.linkedinUrl.trim(),
      githubUrl: values.githubUrl.trim(),
      twitterUrl: values.twitterUrl.trim(),
      instagramUrl: values.instagramUrl.trim(),
      websiteUrl: values.websiteUrl.trim(),
    };
  }

  if (section === "skills") {
    return { skills: normalizeTags(values.skills) };
  }

  if (section === "services") {
    return {
      services: (values.services || [])
        .map((entry) => {
          const title = String(entry.title || "").trim();
          const description = String(entry.description || "").trim();
          const deliveryTime = String(entry.deliveryTime || "").trim();
          const priceRaw =
            entry.price == null ? "" : String(entry.price).trim();
          const hasAnyValue = Boolean(
            title || description || deliveryTime || priceRaw,
          );

          if (!hasAnyValue || !title) return null;

          return {
            _key: entry._key,
            title,
            description,
            price: priceRaw ? Number(priceRaw) : 0,
            deliveryTime,
          };
        })
        .filter(Boolean),
    };
  }

  if (section === "portfolio") {
    const projects = [];

    for (const entry of values.portfolioProjects || []) {
      const title = String(entry.title || "").trim();
      const link = String(entry.link || "").trim();
      const hasAnyValue = Boolean(
        title || link || entry.image || entry.imageUrl,
      );
      if (!hasAnyValue || !title) continue;

      let image = entry.image;
      const file = entry.fieldId ? portfolioFilesById[entry.fieldId] : null;

      if (file) {
        const uploaded = await onUploadPortfolioImage(file);
        image = uploaded.image;
      }

      projects.push({
        _key: entry._key,
        title,
        link,
        image,
      });
    }

    return { portfolioProjects: projects };
  }

  return {};
}

export function FreelancerProfileEditDialog({
  open,
  onOpenChange,
  section,
  profile,
  saving,
  onSave,
  onUploadPortfolioImage,
}) {
  const sectionMeta = useMemo(() => getSectionMeta(section), [section]);
  const defaultValues = useMemo(() => createDefaultValues(profile), [profile]);
  const [portfolioFilesById, setPortfolioFilesById] = useState({});
  const [portfolioPreviewsById, setPortfolioPreviewsById] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const methods = useForm({
    resolver: zodResolver(freelancerProfileEditSchema),
    defaultValues,
  });

  const {
    reset,
    clearErrors,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const clearPortfolioRowAssets = useCallback((fieldId) => {
    if (!fieldId) return;

    setPortfolioFilesById((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });

    setPortfolioPreviewsById((prev) => {
      const previewUrl = prev[fieldId];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (!previewUrl) return prev;

      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const clearAllPortfolioAssets = useCallback(() => {
    setPortfolioFilesById({});
    setPortfolioPreviewsById((prev) => {
      Object.values(prev).forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      );
      return {};
    });
  }, []);

  useEffect(() => {
    if (!open) {
      clearAllPortfolioAssets();
      return;
    }

    reset(defaultValues);
    clearErrors();
    clearAllPortfolioAssets();
  }, [
    open,
    section,
    defaultValues,
    reset,
    clearErrors,
    clearAllPortfolioAssets,
  ]);

  useEffect(
    () => () => {
      clearAllPortfolioAssets();
    },
    [clearAllPortfolioAssets],
  );

  const handlePortfolioFileChange = useCallback(
    (fieldId, index, file) => {
      const errorPath = `portfolioProjects.${index}.image`;
      clearErrors(errorPath);
      clearPortfolioRowAssets(fieldId);

      if (!file) {
        return;
      }

      if (!ALLOWED_PORTFOLIO_IMAGE_TYPES.includes(file.type)) {
        setError(errorPath, {
          type: "manual",
          message: "الصيغ المدعومة: JPG و PNG و WEBP و GIF.",
        });
        return;
      }

      if (file.size > MAX_PORTFOLIO_IMAGE_SIZE) {
        setError(errorPath, {
          type: "manual",
          message: "حجم الصورة يجب ألا يتجاوز 5MB.",
        });
        return;
      }

      setPortfolioFilesById((prev) => ({ ...prev, [fieldId]: file }));
      setPortfolioPreviewsById((prev) => ({
        ...prev,
        [fieldId]: URL.createObjectURL(file),
      }));
    },
    [clearErrors, clearPortfolioRowAssets, setError],
  );

  const handlePortfolioProjectRemove = useCallback(
    (_index, fieldId) => {
      clearPortfolioRowAssets(fieldId);
    },
    [clearPortfolioRowAssets],
  );

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmittingProfile(true);

    try {
      const payload = await buildSubmitPayload({
        section,
        values,
        portfolioFilesById,
        onUploadPortfolioImage,
      });

      await onSave(payload);
      onOpenChange(false);
    } finally {
      setIsSubmittingProfile(false);
    }
  });

  const hasErrors = Object.values(errors).some((value) => {
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.some((item) => Boolean(item && Object.keys(item).length));
    }
    return Boolean(Object.keys(value).length);
  });

  const submitting = saving || isSubmittingProfile;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        hideCloseButton
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="إغلاق"
          disabled={submitting}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 outline-none transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5BDA] focus-visible:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-right">{sectionMeta.title}</DialogTitle>
          <DialogDescription className="text-right">
            {sectionMeta.description}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={onSubmit}>
            {section === "header" && <HeaderEditorSection />}

            {section === "about" && <AboutEditorSection />}

            {section === "details" && <DetailsEditorSection />}

            {section === "social" && <SocialEditorSection />}

            {section === "skills" && <SkillsEditorSection />}

            {section === "services" && <ServicesEditorSection />}

            {section === "portfolio" && (
              <PortfolioEditorSection
                previewsById={portfolioPreviewsById}
                onFileChange={handlePortfolioFileChange}
                onRemoveProject={handlePortfolioProjectRemove}
              />
            )}

            {hasErrors ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                راجع الحقول الموضحة قبل الحفظ.
              </div>
            ) : null}

            <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
