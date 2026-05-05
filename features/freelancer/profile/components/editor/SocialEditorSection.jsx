"use client";

import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../shared/FieldError";
import { SOCIAL_PLATFORMS } from "../../lib/socialPlatforms";

export function SocialEditorSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      {SOCIAL_PLATFORMS.map(({ key, label, icon: Icon, placeholder }) => {
        const value = watch(key) || "";
        const filled = Boolean(value);
        return (
          <div key={key} className="space-y-1">
            <div
              className={`group flex items-center gap-3 rounded-xl border bg-white p-2.5 transition focus-within:border-[#5D5BDA] focus-within:bg-[#F7F7FF] focus-within:shadow-[0_0_0_3px_rgba(93,91,218,0.08)] ${
                filled
                  ? "border-[#E0E0FF]"
                  : "border-slate-200 hover:border-[#C7C5F4]"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                  filled
                    ? "bg-[#5D5BDA] text-white"
                    : "bg-[#F5F5FF] text-[#5D5BDA] group-focus-within:bg-[#5D5BDA] group-focus-within:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex flex-1 flex-col">
                <Label
                  htmlFor={key}
                  className="text-xs font-semibold text-slate-500"
                >
                  {label}
                </Label>
                <Input
                  id={key}
                  dir="ltr"
                  placeholder={placeholder}
                  className="h-8 border-0 bg-transparent px-0 text-sm text-slate-700 placeholder:text-slate-300 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  {...register(key)}
                />
              </div>

              {filled ? (
                <button
                  type="button"
                  onClick={() => setValue(key, "", { shouldDirty: true })}
                  aria-label={`مسح ${label}`}
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-100 hover:text-slate-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            <FieldError>{errors[key]?.message}</FieldError>
          </div>
        );
      })}

      <p className="px-1 pt-2 text-xs text-slate-400">
        اترك أي حقل فارغاً ولن يظهر في ملفك الشخصي.
      </p>
    </div>
  );
}
