"use client";

import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "../shared/EmptyState";

export function ProfileAboutSection({ profile, onEdit }) {
  const hasBio = Boolean(profile?.bio);

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
      <SectionHeader
        title="نبذة عني"
        section="about"
        isEmpty={!hasBio}
        onEdit={onEdit}
      />
      <CardContent className="px-4 py-4 text-right text-sm leading-7 text-slate-500 sm:px-6 sm:py-5 sm:text-base">
        {hasBio ? (
          <p className="whitespace-pre-line break-words">{profile.bio}</p>
        ) : (
          <EmptyState
            icon={FileText}
            title="لم تضف نبذة بعد"
            description="عرّف العملاء بنفسك وخبراتك بكلمات مختصرة."
            actionLabel="أضف نبذة عنك"
            onAction={() => onEdit?.("about")}
          />
        )}
      </CardContent>
    </Card>
  );
}
