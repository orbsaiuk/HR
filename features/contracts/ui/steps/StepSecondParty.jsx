"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepSecondParty({ register, errors }) {
  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-right text-lg md:text-2xl font-semibold text-[#1F2937]">
        بيانات الطرف الثاني (المتعاقد)
      </h3>

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="second-party-full-name"
            className="text-sm text-[#344054]"
          >
            الاسم الكامل
          </Label>
          <Input
            id="second-party-full-name"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="الاسم الكامل"
            {...register("secondPartyFullName")}
          />
          <FieldError message={errors.secondPartyFullName?.message} />
        </div>

        <div>
          <Label
            htmlFor="second-party-whatsapp"
            className="text-sm text-[#344054]"
          >
            رقم الواتساب
          </Label>
          <Input
            id="second-party-whatsapp"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            inputMode="tel"
            placeholder="رقم الواتساب"
            {...register("secondPartyWhatsapp")}
          />
          <FieldError message={errors.secondPartyWhatsapp?.message} />
        </div>
      </div>

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="second-party-national-id"
            className="text-sm text-[#344054]"
          >
            الرقم القومي
          </Label>
          <Input
            id="second-party-national-id"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            inputMode="numeric"
            maxLength={14}
            placeholder="الرقم القومي"
            {...register("secondPartyNationalId")}
          />
          <FieldError message={errors.secondPartyNationalId?.message} />
        </div>

        <div>
          <Label
            htmlFor="second-party-address"
            className="text-sm text-[#344054]"
          >
            العنوان
          </Label>
          <Input
            id="second-party-address"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="العنوان"
            {...register("secondPartyAddress")}
          />
          <FieldError message={errors.secondPartyAddress?.message} />
        </div>
      </div>
    </div>
  );
}
