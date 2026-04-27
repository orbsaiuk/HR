import Link from "next/link";
import {
  Globe,
  Languages,
  Mail,
  Pencil,
  Phone,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "./EmptyState";
import { getSocialPlatformByType } from "../lib/socialPlatforms";

function iconByType(type) {
  return getSocialPlatformByType(type)?.icon || Globe;
}

function InlineAddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-400 transition hover:border-[#5D5BDA] hover:bg-[#F5F5FF] hover:text-[#5D5BDA]"
    >
      <Plus className="h-4 w-4" />
      {label}
    </button>
  );
}

export function ProfileSidebar({ profile, onEdit }) {
  const hasPhone = Boolean(profile.phone);
  const hasLanguages = profile.languages && profile.languages.length > 0;
  const socialLinks = profile.socialLinks || [];
  const hasSocial = socialLinks.length > 0;

  return (
    <>
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-4xl">
        <CardHeader className="flex-row items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <CardTitle className="text-lg font-bold text-slate-700 sm:text-xl">
            تفاصيل إضافية
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            aria-label="تعديل التفاصيل"
            onClick={() => onEdit?.("details")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-5 p-4 text-right sm:space-y-6 sm:p-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail className="h-4 w-4 shrink-0" />
              <p className="text-sm font-semibold">الإيميل</p>
            </div>
            <p className="break-all text-sm font-medium text-slate-600">
              {profile.email || ""}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Phone className="h-4 w-4 shrink-0" />
              <p className="text-sm font-semibold">رقم الهاتف</p>
            </div>
            {hasPhone ? (
              <p className="text-sm font-medium text-slate-600" dir="ltr">
                {profile.phone}
              </p>
            ) : (
              <InlineAddButton label="أضف رقم هاتفك" onClick={() => onEdit?.("details")} />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Languages className="h-4 w-4 shrink-0" />
              <p className="text-sm font-semibold">اللغة</p>
            </div>
            {hasLanguages ? (
              <div className="flex flex-wrap justify-end gap-2">
                {profile.languages.map((language, index) => (
                  <Badge
                    key={`${language}-${index}`}
                    variant="secondary"
                    className="rounded-lg border-transparent bg-[#F5F5FF] px-3 py-1 text-xs font-semibold text-[#5D5BDA] shadow-none"
                  >
                    {language}
                  </Badge>
                ))}
              </div>
            ) : (
              <InlineAddButton label="أضف اللغات التي تتقنها" onClick={() => onEdit?.("details")} />
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-4xl">
        <CardHeader className="flex-row items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
          <CardTitle className="text-lg font-bold text-slate-700 sm:text-xl">
            روابط التواصل الاجتماعي
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
            aria-label="تعديل الروابط"
            onClick={() => onEdit?.("social")}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-4 text-right sm:p-5">
          {hasSocial ? (
            <div className="flex flex-wrap justify-end gap-2">
              {socialLinks.map((linkItem) => {
                const Icon = iconByType(linkItem.type);
                return (
                  <Link
                    key={linkItem.platformKey || linkItem.type}
                    href={linkItem.url}
                    target="_blank"
                    rel="noreferrer"
                    title={linkItem.value}
                    className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[#E0E0FF] bg-[#F7F7FF] px-3 py-1.5 text-sm font-semibold text-[#5D5BDA] transition hover:bg-[#EBEBFF] hover:text-[#4A48C9]"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{linkItem.platform}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Globe}
              title="لم تضف روابط بعد"
              description="أضف حساباتك على منصات التواصل ليجدك العملاء."
              actionLabel="إضافة روابط"
              onAction={() => onEdit?.("social")}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
