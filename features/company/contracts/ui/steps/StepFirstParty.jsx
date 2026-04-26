"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepFirstParty({ register, errors }) {
  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-right text-lg font-semibold text-[#1F2937] md:text-2xl">
        بيانات الطرف الأول
      </h3>

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="first-party-company-name"
            className="text-sm text-[#344054]"
          >
            اسم الشركة
          </Label>
          <Input
            id="first-party-company-name"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="اسم الشركة"
            {...register("firstPartyCompanyName")}
          />
          <FieldError message={errors.firstPartyCompanyName?.message} />
        </div>

        <div>
          <Label
            htmlFor="first-party-legal-representative"
            className="text-sm text-[#344054]"
          >
            الممثل القانوني
          </Label>
          <Input
            id="first-party-legal-representative"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="الممثل القانوني"
            {...register("firstPartyLegalRepresentative")}
          />
          <FieldError message={errors.firstPartyLegalRepresentative?.message} />
        </div>
      </div>
    </div>
  );
}
