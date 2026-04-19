"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AmountCurrencyField } from "./AmountCurrencyField";
import { FieldError } from "./FieldError";

export function ContractDurationPenaltyRow({
  register,
  errors,
  watch,
  setValue,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="contract-duration" className="text-sm text-[#344054]">
          مدة العقد
        </Label>
        <Input
          id="contract-duration"
          className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
          placeholder="مثال: سنة واحدة قابلة للتجديد"
          {...register("contractDuration")}
        />
        <FieldError message={errors.contractDuration?.message} />
      </div>

      <AmountCurrencyField
        label="الشرط الجزائي"
        amountId="contract-penalty"
        amountName="penaltyClauseAmount"
        currencyName="penaltyClauseCurrency"
        min={0}
        register={register}
        watch={watch}
        setValue={setValue}
        amountError={errors.penaltyClauseAmount?.message}
        currencyError={errors.penaltyClauseCurrency?.message}
      />
    </div>
  );
}
