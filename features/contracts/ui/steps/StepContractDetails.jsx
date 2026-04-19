"use client";

import { format } from "date-fns";
import { AmountCurrencyField } from "./contract-details/AmountCurrencyField";
import { ContractDurationPenaltyRow } from "./contract-details/ContractDurationPenaltyRow";
import { DatePickerField } from "./contract-details/DatePickerField";
import { parseContractDate } from "./contract-details/dateHelpers";
import { FieldError } from "./contract-details/FieldError";
import { syncContractDurationWithDates } from "./contract-details/syncContractDurationWithDates";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

function getContractTypeLabel(type) {
  if (!type) return "-";
  return String(type).trim();
}

export function StepContractDetails({
  register,
  errors,
  watch,
  setValue,
  contractType,
}) {
  const startDateValue = watch("startDate");
  const endDateValue = watch("endDate");
  const selectedStartDate = parseContractDate(startDateValue);
  const selectedEndDate = parseContractDate(endDateValue);

  function handleDateChange(fieldName, nextDate) {
    const nextValue = nextDate ? format(nextDate, "yyyy-MM-dd") : "";

    const nextStartDate =
      fieldName === "startDate" ? nextDate : selectedStartDate;
    const nextEndDate = fieldName === "endDate" ? nextDate : selectedEndDate;

    setValue(fieldName, nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    if (fieldName === "startDate") {
      if (!nextDate) {
        setValue("endDate", "", {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        syncContractDurationWithDates(setValue, null, null);
        return;
      }

      if (selectedEndDate && selectedEndDate.getTime() < nextDate.getTime()) {
        setValue("endDate", "", {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
        syncContractDurationWithDates(setValue, nextDate, null);
        return;
      }

      syncContractDurationWithDates(setValue, nextStartDate, nextEndDate);
      return;
    }

    syncContractDurationWithDates(setValue, nextStartDate, nextEndDate);
  }

  return (
    <div className="space-y-4" dir="rtl">
      <h3 className="text-right text-lg md:text-3xl font-semibold text-[#1F2937]">
        تفاصيل العقد
      </h3>

      <div className="rounded-md border border-[#E7EBF3] bg-[#FAFBFF] p-3 text-sm text-[#374151]">
        <span className="font-medium text-[#6B7280]">نوع العقد:</span>{" "}
        <span className="font-semibold text-[#1F2937]">
          {getContractTypeLabel(contractType || watch("contractType"))}
        </span>
      </div>

      <input type="hidden" {...register("contractType")} />

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="contract-job-title"
            className="text-sm text-[#344054]"
          >
            المسمى الوظيفي
          </Label>
          <Input
            id="contract-job-title"
            className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
            placeholder="المسمى الوظيفي"
            {...register("jobTitle")}
          />
          <FieldError message={errors.jobTitle?.message} />
        </div>

        <AmountCurrencyField
          label="الراتب / المقابل"
          amountId="contract-compensation"
          amountName="compensationAmount"
          currencyName="compensationCurrency"
          min={1}
          register={register}
          watch={watch}
          setValue={setValue}
          amountError={errors.compensationAmount?.message}
          currencyError={errors.compensationCurrency?.message}
        />
      </div>

      <div className="grid gap-2 md:gap-4 sm:grid-cols-2">
        <DatePickerField
          label="تاريخ البدء"
          inputId="contract-start-date"
          fieldName="startDate"
          register={register}
          selectedDate={selectedStartDate}
          onSelectDate={(date) => handleDateChange("startDate", date)}
          placeholder="اختر تاريخ البدء"
          error={errors.startDate?.message}
        />

        <DatePickerField
          label="تاريخ الانتهاء"
          inputId="contract-end-date"
          fieldName="endDate"
          register={register}
          selectedDate={selectedEndDate}
          onSelectDate={(date) => {
            if (!selectedStartDate) return;
            handleDateChange("endDate", date);
          }}
          placeholder="اختر تاريخ الانتهاء"
          disabledPlaceholder="اختر تاريخ البدء أولاً"
          disabled={!selectedStartDate}
          minDate={selectedStartDate}
          error={errors.endDate?.message}
        />
      </div>

      <ContractDurationPenaltyRow
        register={register}
        errors={errors}
        watch={watch}
        setValue={setValue}
      />
    </div>
  );
}
