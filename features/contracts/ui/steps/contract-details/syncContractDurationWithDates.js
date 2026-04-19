import { differenceInCalendarDays } from "date-fns";

export function syncContractDurationWithDates(setValue, startDate, endDate) {
  if (!startDate || !endDate) {
    setValue("contractDuration", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    return;
  }

  const durationDays = differenceInCalendarDays(endDate, startDate) + 1;
  if (durationDays <= 0) {
    setValue("contractDuration", "", {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    return;
  }

  const durationLabel = `${durationDays} ${durationDays === 1 ? "يوم" : "أيام"}`;
  setValue("contractDuration", durationLabel, {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,
  });
}
