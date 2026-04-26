const LEGACY_DRAFT_KEY = "org-registration-draft";
const LEGACY_LOGO_KEY = "org-registration-draft-logo";

export const ORG_REGISTRATION_FORM_ID = "org-registration";
export const ORG_DRAFT_STORAGE_EVENT = "org-registration-draft:updated";
export const ORG_DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7;

function isClient() {
  return typeof window !== "undefined";
}

function asTimestamp(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function uniqueKeys(keys) {
  return [...new Set(keys.filter(Boolean))];
}

function parseJson(raw) {
  if (typeof raw !== "string") return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function buildOrgDraftKey(formId = ORG_REGISTRATION_FORM_ID, userId) {
  if (!userId) return LEGACY_DRAFT_KEY;
  return `draft:${formId}:${userId}`;
}

export function buildOrgDraftLogoKey(
  formId = ORG_REGISTRATION_FORM_ID,
  userId,
) {
  if (!userId) return LEGACY_LOGO_KEY;
  return `draft-logo:${formId}:${userId}`;
}

export function getOrgDraftReadKeys(formId = ORG_REGISTRATION_FORM_ID, userId) {
  return uniqueKeys([buildOrgDraftKey(formId, userId), LEGACY_DRAFT_KEY]);
}

export function getOrgDraftLogoReadKeys(
  formId = ORG_REGISTRATION_FORM_ID,
  userId,
) {
  return uniqueKeys([buildOrgDraftLogoKey(formId, userId), LEGACY_LOGO_KEY]);
}

export function parseStoredDraft(raw) {
  const parsed = parseJson(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  // Supports both wrapped payloads and legacy plain-object drafts.
  if (parsed.values && typeof parsed.values === "object") {
    return {
      values: parsed.values,
      step: Number.isFinite(parsed.step) ? parsed.step : 0,
      savedAt: asTimestamp(parsed.savedAt),
    };
  }

  return {
    values: parsed,
    step: 0,
    savedAt: null,
  };
}

export function buildStoredDraftPayload(values, options = {}) {
  const savedAt =
    options.savedAt && Number.isFinite(options.savedAt)
      ? options.savedAt
      : Date.now();

  return {
    values,
    step: Number.isFinite(options.step) ? options.step : 0,
    savedAt,
  };
}

export function hasMeaningfulDraftContent(values) {
  if (!values || typeof values !== "object") return false;

  return Object.values(values).some((value) => {
    if (value == null) return false;

    if (typeof value === "string") {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === "object") {
      return Object.keys(value).length > 0;
    }

    return true;
  });
}

export function isDraftExpired(savedAt, maxAgeMs = ORG_DRAFT_MAX_AGE_MS) {
  if (!savedAt || !Number.isFinite(maxAgeMs) || maxAgeMs <= 0) return false;
  return Date.now() - savedAt > maxAgeMs;
}

export function formatDraftAge(savedAt) {
  if (!savedAt) return null;

  const elapsedMs = Math.max(0, Date.now() - savedAt);
  const minutes = Math.floor(elapsedMs / 60000);

  if (minutes < 1) return "منذ أقل من دقيقة";
  if (minutes < 60) {
    return minutes === 1 ? "منذ دقيقة" : `منذ ${minutes} دقيقة`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "منذ ساعة" : `منذ ${hours} ساعة`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? "منذ يوم" : `منذ ${days} أيام`;
}

export function findOrgDraftRecord({
  formId = ORG_REGISTRATION_FORM_ID,
  userId,
  maxAgeMs = ORG_DRAFT_MAX_AGE_MS,
  cleanupExpired = true,
} = {}) {
  if (!isClient()) return null;

  const keys = getOrgDraftReadKeys(formId, userId);

  for (const key of keys) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    const parsed = parseStoredDraft(raw);
    if (!parsed || !hasMeaningfulDraftContent(parsed.values)) {
      continue;
    }

    if (isDraftExpired(parsed.savedAt, maxAgeMs)) {
      if (cleanupExpired) {
        localStorage.removeItem(key);
      }
      continue;
    }

    return {
      key,
      values: parsed.values,
      step: parsed.step,
      savedAt: parsed.savedAt,
    };
  }

  return null;
}

export function notifyOrgDraftUpdated(formId, userId) {
  if (!isClient()) return;

  window.dispatchEvent(
    new CustomEvent(ORG_DRAFT_STORAGE_EVENT, {
      detail: {
        formId: formId || ORG_REGISTRATION_FORM_ID,
        userId: userId || null,
      },
    }),
  );
}
