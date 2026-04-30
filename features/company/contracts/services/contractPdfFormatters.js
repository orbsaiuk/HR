function removeUnpairedSurrogates(input) {
  let result = "";

  for (let index = 0; index < input.length; index += 1) {
    const code = input.charCodeAt(index);

    // High surrogate
    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = input.charCodeAt(index + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        result += input[index] + input[index + 1];
        index += 1;
      }
      continue;
    }

    // Skip lone low surrogate
    if (code >= 0xdc00 && code <= 0xdfff) {
      continue;
    }

    result += input[index];
  }

  return result;
}

export function sanitizePdfText(value) {
  if (value == null) return "-";

  let text = removeUnpairedSurrogates(String(value));

  // Strip characters that can break PDF text shaping/subsetting.
  text = text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    // Remove bidi control marks that may appear in localized date strings.
    .replace(/[\u200E\u200F\u061C]/g, "")
    .trim();

  return text || "-";
}

export function toSafeString(value) {
  return sanitizePdfText(value);
}

export function formatDate(value) {
  if (!value) return "-";

  let date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else if (typeof value === "string") {
    date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      const parsed = Date.parse(value);
      if (!Number.isNaN(parsed)) {
        date = new Date(parsed);
      } else {
        return toSafeString(value);
      }
    }
  } else {
    return "-";
  }

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear());

  return `${day}/${month}/${year}`;
}

export function formatAmount(amount, currency = "EGP") {
  if (amount == null || amount === "") return "-";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) {
    return `${toSafeString(amount)} ${toSafeString(currency)}`;
  }

  return `${numericAmount.toLocaleString("en-US")} ${toSafeString(currency)}`;
}

export function buildSecondPartyName(formData = {}) {
  const firstName = String(formData.secondPartyFirstName || "").trim();
  const lastName = String(formData.secondPartyLastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return fullName || toSafeString(formData.secondPartyFullName);
}
