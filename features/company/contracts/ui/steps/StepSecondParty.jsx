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
      <h3 className="text-right text-lg font-semibold text-[#1F2937] md:text-2xl">
        بيانات الطرف الثاني (المتعاقد)
      </h3>

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="second-party-first-name"
            className="text-sm text-[#344054]"
          >
            الاسم الأول
          </Label>
          <Input
            id="second-party-first-name"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="الاسم الأول"
            {...register("secondPartyFirstName")}
          />
          <FieldError message={errors.secondPartyFirstName?.message} />
        </div>

        <div>
          <Label
            htmlFor="second-party-last-name"
            className="text-sm text-[#344054]"
          >
            اسم العائلة
          </Label>
          <Input
            id="second-party-last-name"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="اسم العائلة"
            {...register("secondPartyLastName")}
          />
          <FieldError message={errors.secondPartyLastName?.message} />
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

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="second-party-phone" className="text-sm text-[#344054]">
            رقم الهاتف
          </Label>
          <Input
            id="second-party-phone"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            inputMode="tel"
            placeholder="رقم الهاتف"
            {...register("secondPartyPhone")}
          />
          <FieldError message={errors.secondPartyPhone?.message} />
        </div>

        <div>
          <Label htmlFor="second-party-email" className="text-sm text-[#344054]">
            البريد الإلكتروني
          </Label>
          <Input
            id="second-party-email"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            type="email"
            inputMode="email"
            placeholder="example@domain.com"
            {...register("secondPartyEmail")}
          />
          <FieldError message={errors.secondPartyEmail?.message} />
        </div>
      </div>
    </div>
  );
}
