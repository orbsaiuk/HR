import { CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const COMPLETION_ITEMS = [
  {
    key: "headline",
    label: "المسمى المهني",
    section: "header",
    isComplete: (profile) => Boolean(profile.headline),
  },
  {
    key: "bio",
    label: "نبذة عنك",
    section: "about",
    isComplete: (profile) => Boolean(profile.bio),
  },
  {
    key: "skills",
    label: "المهارات",
    section: "skills",
    isComplete: (profile) => (profile.skills || []).length > 0,
  },
  {
    key: "services",
    label: "خدمة واحدة على الأقل",
    section: "services",
    isComplete: (profile) => (profile.services || []).length > 0,
  },
  {
    key: "portfolio",
    label: "عمل واحد على الأقل",
    section: "portfolio",
    isComplete: (profile) => (profile.portfolioProjects || []).length > 0,
  },
  {
    key: "details",
    label: "الهاتف واللغات",
    section: "details",
    isComplete: (profile) => Boolean(profile.phone) && (profile.languages || []).length > 0,
  },
  {
    key: "social",
    label: "روابط التواصل",
    section: "social",
    isComplete: (profile) => (profile.socialLinks || []).length > 0,
  },
];

function getCompletion(profile) {
  const items = COMPLETION_ITEMS.map((item) => ({
    ...item,
    complete: item.isComplete(profile),
  }));
  const completedCount = items.filter((item) => item.complete).length;
  const percentage = Math.round((completedCount / items.length) * 100);

  return {
    percentage,
    missing: items.filter((item) => !item.complete),
  };
}

export function ProfileCompletionBanner({ profile, onEdit }) {
  const { percentage, missing } = getCompletion(profile);
  if (missing.length === 0) return null;

  const nextActions = missing.slice(0, 4);

  return (
    <Card className="mb-4 rounded-2xl border border-[#E0E0FF] bg-[#F5F5FF] shadow-none sm:mb-6 sm:rounded-[1.5rem]">
      <CardContent className="space-y-4 px-4 py-4 text-right sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5D5BDA]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-base font-bold text-slate-800">أكمل ملفك الشخصي</p>
              <p className="break-words text-sm text-slate-500">
                ملفك أقوى عندما يرى العميل خبرتك، خدماتك، وأعمالك بوضوح.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 text-center shadow-sm lg:min-w-36">
            <p className="text-2xl font-black text-[#5D5BDA]">{percentage}%</p>
            <p className="text-xs font-semibold text-slate-400">قوة الملف</p>
          </div>
        </div>

        <Progress
          value={percentage}
          className="h-2.5 bg-white"
          indicatorClassName="bg-[#5D5BDA]"
          aria-label="نسبة اكتمال الملف الشخصي"
        />

        <div className="flex flex-wrap gap-2">
          {nextActions.map((item) => (
            <Button
              key={item.key}
              type="button"
              variant="outline"
              className="h-9 rounded-full border-[#D8D7FF] bg-white px-3 text-xs font-bold text-[#5D5BDA] hover:bg-[#EBEBFF] sm:text-sm"
              onClick={() => onEdit?.(item.section)}
            >
              <CheckCircle2 className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
