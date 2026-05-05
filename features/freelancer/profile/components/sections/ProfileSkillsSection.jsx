"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "../shared/EmptyState";

export function ProfileSkillsSection({ profile, onEdit }) {
  const skills = profile?.skills || [];
  const hasSkills = skills.length > 0;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
      <SectionHeader
        title="المهارات"
        section="skills"
        isEmpty={!hasSkills}
        onEdit={onEdit}
      />
      <CardContent className="px-4 py-4 sm:px-6 sm:py-5">
        {hasSkills ? (
          <div className="flex flex-wrap justify-end gap-2 sm:gap-3">
            {skills.map((skill, index) => (
              <Badge
                key={`${skill}-${index}`}
                variant="secondary"
                className="rounded-lg border-transparent bg-[#F5F5FF] px-3 py-1.5 text-xs font-semibold text-[#5D5BDA] shadow-none hover:bg-[#EBEBFF] sm:px-4 sm:py-2 sm:text-sm"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="لم تضف مهارات بعد"
            description="أبرز مهاراتك ليسهل على العملاء معرفة خبراتك."
            actionLabel="أضف مهاراتك"
            onAction={() => onEdit?.("skills")}
          />
        )}
      </CardContent>
    </Card>
  );
}
