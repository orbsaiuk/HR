"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTRACT_CURRENCIES } from "../../../model/contractSchema";
import { FieldError } from "./FieldError";

export function AmountCurrencyField({
  label,
  amountId,
  amountName,
  currencyName,
  min,
  amountPlaceholder = "0",
  register,
  watch,
  setValue,
  amountError,
  currencyError,
}) {
  const currencyValue = watch(currencyName) || "EGP";

  function handleCurrencyChange(value) {
    setValue(currencyName, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  return (
    <div>
      <Label htmlFor={amountId} className="text-sm text-[#344054]">
        {label}
      </Label>
      <input type="hidden" {...register(currencyName)} />

      <div className="mt-2 grid grid-cols-[1fr_110px] gap-2">
        <Input
          id={amountId}
          type="number"
          min={min}
          className="h-10 border-[#D8DFEC] text-right"
          placeholder={amountPlaceholder}
          {...register(amountName)}
        />

        <Select value={currencyValue} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="h-10 border-[#D8DFEC]">
            <SelectValue placeholder="العملة" />
          </SelectTrigger>
          <SelectContent>
            {CONTRACT_CURRENCIES.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <FieldError message={amountError} />
      <FieldError message={currencyError} />
    </div>
  );
}
