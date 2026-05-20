import { MapPin, Pencil, Plus, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileHeader({ profile, onEdit }) {
  const hasHeadline = Boolean(profile.headline);
  const hasLocation = Boolean(profile.location);
  const hasName = Boolean(profile.name);
  const hasCategory = Boolean(profile.category);
  const hasSubcategory = Boolean(profile.subcategory);

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-none sm:rounded-[1.5rem]">
      <div className="relative h-28 overflow-hidden sm:h-40">
        <div className="absolute inset-0 bg-[linear-gradient(110deg,#14596C_0%,#14596C_45%,#FF6F3C_45%,#FF6F3C_60%,#F59334_60%,#F59334_100%)]" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="absolute left-3 top-3 h-8 w-8 rounded-lg border-slate-200 bg-white text-slate-400 hover:bg-slate-50 sm:left-4 sm:top-4"
          aria-label="تعديل الملف الشخصي"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="relative px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="relative -mt-14 sm:-mt-20">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md sm:h-32 sm:w-32 sm:border-[6px]">
              <AvatarImage
                src={profile.avatar || undefined}
                alt={profile.name || ""}
              />
              <AvatarFallback className="bg-slate-100 text-xl font-semibold text-slate-700 sm:text-2xl">
                {profile.name?.slice(0, 2) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="min-w-0 flex-1 text-right sm:mb-2">
            {hasName ? (
              <h1 className="break-words text-2xl font-bold text-slate-800 sm:text-3xl">
                {profile.name}
              </h1>
            ) : (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1 text-xl font-bold text-slate-400 transition hover:border-[#5D5BDA] hover:bg-[#F5F5FF] hover:text-[#5D5BDA] sm:text-2xl"
              >
                <Plus className="h-5 w-5" />
                أضف اسمك
              </button>
            )}

            {hasHeadline ? (
              <p className="mt-1 break-words text-base font-medium text-slate-500 sm:text-lg">
                {profile.headline}
              </p>
            ) : (
              <button
                type="button"
                onClick={onEdit}
                className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1 text-sm font-medium text-slate-400 transition hover:border-[#5D5BDA] hover:bg-[#F5F5FF] hover:text-[#5D5BDA]"
              >
                <Plus className="h-4 w-4" />
                أضف مسماك المهني
              </button>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hasLocation ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="break-words">{profile.location}</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1 text-sm font-medium text-slate-400 transition hover:border-[#5D5BDA] hover:bg-[#F5F5FF] hover:text-[#5D5BDA]"
                >
                  <MapPin className="h-4 w-4" />
                  أضف موقعك
                </button>
              )}

              {hasCategory ? (
                <p className="flex items-center gap-1.5 text-sm font-medium text-slate-400">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span className="break-words">
                    {profile.category}
                    {hasSubcategory && ` / ${profile.subcategory}`}
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1 text-sm font-medium text-slate-400 transition hover:border-[#5D5BDA] hover:bg-[#F5F5FF] hover:text-[#5D5BDA]"
                >
                  <Briefcase className="h-4 w-4" />
                  أضف تخصصك
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
