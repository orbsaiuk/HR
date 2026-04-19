import { isValid, parseISO } from "date-fns";

export function parseContractDate(value) {
  if (!value) return undefined;

  if (value instanceof Date) {
    return isValid(value) ? value : undefined;
  }

  if (typeof value === "string") {
    const parsedDate = parseISO(value);
    return isValid(parsedDate) ? parsedDate : undefined;
  }

  return undefined;
}
