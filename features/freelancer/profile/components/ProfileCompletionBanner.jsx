import { ArrowLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { getProfileCompletion } from "../model/useProfileCompletion";

export function ProfileCompletionBanner({
  profile,
  onCompleteProfile,
  hideAction = false,
}) {
  const { percentage, missing } = getProfileCompletion(profile);
  if (missing.length === 0) return null;

  const missingLabels = missing.map((item) => item.label);
  const summary =
    missingLabels.length <= 2
      ? missingLabels.join(" و")
      : `${missingLabels[0]} و${missingLabels.length - 1} عناصر أخرى`;

  return (
    <Card className="mb-4 overflow-hidden rounded-2xl border border-[#E0E0FF] bg-gradient-to-l from-[#F5F5FF] to-white shadow-none sm:mb-6 sm:rounded-[1.5rem]">
      <CardContent className="px-4 py-4 text-right sm:px-6 sm:py-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#5D5BDA]/10 text-[#5D5BDA]">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800">
                  أكمل ملفك الشخصي
                </p>
                <p className="break-words text-sm leading-relaxed text-slate-500">
                  ينقصك <span className="font-semibold text-[#5D5BDA]">{summary}</span> لتقوية ملفك
                </p>
              </div>

              <div className="shrink-0 rounded-2xl bg-white px-4 py-2.5 text-center shadow-sm">
                <p className="text-2xl font-black text-[#5D5BDA]">
                  {percentage}%
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  اكتمال
                </p>
              </div>
            </div>

            <Progress
              value={percentage}
              className="h-2 bg-[#E0E0FF]"
              indicatorClassName="bg-[#5D5BDA] rounded-full"
              aria-label="نسبة اكتمال الملف الشخصي"
            />

            {!hideAction && onCompleteProfile && (
              <Button
                type="button"
                className="mt-1 h-9 gap-2 rounded-xl bg-[#5D5BDA] px-5 text-sm font-bold text-white hover:bg-[#4B49C8]"
                onClick={onCompleteProfile}
              >
                <ArrowLeft className="h-4 w-4" />
                أكمل ملفك الآن
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
