"use client";

import { useEffect, useCallback, useMemo, useRef } from "react";
import {
  ORG_REGISTRATION_FORM_ID,
  buildOrgDraftKey,
  buildOrgDraftLogoKey,
  buildStoredDraftPayload,
  findOrgDraftRecord,
  getOrgDraftLogoReadKeys,
  getOrgDraftReadKeys,
  hasMeaningfulDraftContent,
  notifyOrgDraftUpdated,
} from "./orgDraftStorage";

const DEBOUNCE_MS = 500;

const INDUSTRY_VALUES = new Set([
  "technology",
  "healthcare",
  "finance",
  "education",
  "retail",
  "manufacturing",
  "consulting",
  "media",
  "nonprofit",
  "government",
  "other",
]);

const INDUSTRY_ALIASES = {
  technology: "technology",
  "تكنولوجيا المعلومات": "technology",
  healthcare: "healthcare",
  "الرعاية الصحية": "healthcare",
  finance: "finance",
  "الخدمات المالية": "finance",
  education: "education",
  التعليم: "education",
  retail: "retail",
  التجزئة: "retail",
  manufacturing: "manufacturing",
  التصنيع: "manufacturing",
  consulting: "consulting",
  الاستشارات: "consulting",
  media: "media",
  "media & entertainment": "media",
  "الإعلام والترفيه": "media",
  nonprofit: "nonprofit",
  "non-profit": "nonprofit",
  "غير ربحي": "nonprofit",
  government: "government",
  حكومي: "government",
  other: "other",
  أخرى: "other",
};

const SIZE_VALUES = new Set(["1-10", "11-50", "51-200", "201-500", "500+"]);

function normalizeDraftStep(step, maxStep = Number.POSITIVE_INFINITY) {
  const normalizedMax =
    Number.isFinite(maxStep) && maxStep >= 0
      ? Math.floor(maxStep)
      : Number.POSITIVE_INFINITY;
  const normalizedStep = Number.isFinite(step) ? Math.floor(step) : 0;

  return Math.max(0, Math.min(normalizedStep, normalizedMax));
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOrgIndustry(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return "";

  if (INDUSTRY_VALUES.has(normalized)) return normalized;
  return INDUSTRY_ALIASES[normalized] || "";
}

function normalizeOrgSize(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return "";

  if (SIZE_VALUES.has(normalized)) return normalized;

  if (normalized.includes("1-10")) return "1-10";
  if (normalized.includes("11-50")) return "11-50";
  if (normalized.includes("51-200")) return "51-200";
  if (normalized.includes("201-500")) return "201-500";
  if (normalized.includes("500+")) return "500+";

  return "";
}

function normalizeDraftValues(values) {
  if (!values || typeof values !== "object") return {};

  return {
    ...values,
    orgIndustry: normalizeOrgIndustry(values.orgIndustry),
    orgSize: normalizeOrgSize(values.orgSize),
  };
}

function getFirstStoredValue(keys) {
  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value !== null) {
      return { key, value };
    }
  }

  return null;
}

/**
 * Convert a File to a base64 data URL with metadata
 */
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        data: reader.result,
        name: file.name,
        type: file.type,
        lastModified: file.lastModified,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 data back to a File object
 */
function base64ToFile(base64Data) {
  if (!base64Data?.data || !base64Data?.name) return null;

  try {
    // Extract the base64 content from data URL
    const arr = base64Data.data.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || base64Data.type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], base64Data.name, {
      type: mime,
      lastModified: base64Data.lastModified || Date.now(),
    });
  } catch (error) {
    console.warn("Failed to convert base64 to file:", error);
    return null;
  }
}

/**
 * Custom hook for persisting organization registration form data to localStorage.
 * Handles saving on field changes and restoring on mount.
 * Logo is stored as base64 in a separate key to avoid large JSON parsing.
 */
export function useOrgFormPersistence(methods, optionsOrEnabled = true) {
  const { watch, reset, getValues, setValue } = methods;
  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);
  const skipNextSave = useRef(false);

  const options =
    typeof optionsOrEnabled === "boolean"
      ? { isEnabled: optionsOrEnabled }
      : optionsOrEnabled || {};

  const {
    isEnabled = true,
    formId = ORG_REGISTRATION_FORM_ID,
    userId,
    currentStep,
    maxStep,
    onRestoreStep,
  } = options;

  const draftStorageKey = useMemo(
    () => buildOrgDraftKey(formId, userId),
    [formId, userId],
  );
  const logoStorageKey = useMemo(
    () => buildOrgDraftLogoKey(formId, userId),
    [formId, userId],
  );
  const draftReadKeys = useMemo(
    () => getOrgDraftReadKeys(formId, userId),
    [formId, userId],
  );
  const logoReadKeys = useMemo(
    () => getOrgDraftLogoReadKeys(formId, userId),
    [formId, userId],
  );

  // Load saved data on mount
  useEffect(() => {
    if (!isEnabled || initialLoadDone.current) return;

    try {
      const draftRecord = findOrgDraftRecord({
        formId,
        userId,
        cleanupExpired: true,
      });

      if (draftRecord) {
        const normalizedValues = normalizeDraftValues(draftRecord.values);
        const restoredStep = normalizeDraftStep(draftRecord.step, maxStep);

        // Exclude orgLogo - we'll handle it separately
        const { orgLogo, ...restorable } = normalizedValues;

        // Set skip flag to true before resetting to prevent the reset-triggered watch from saving
        skipNextSave.current = true;

        // Use reset with keepDefaultValues: true to ensure we merge correctly
        reset({ ...getValues(), ...restorable }, { keepDefaultValues: true });

        // Explicitly set controlled Select fields after reset as a fallback.
        if (restorable.orgSize || restorable.orgIndustry) {
          queueMicrotask(() => {
            if (restorable.orgSize) {
              setValue("orgSize", restorable.orgSize, {
                shouldDirty: false,
                shouldValidate: false,
                shouldTouch: false,
              });
            }

            if (restorable.orgIndustry) {
              setValue("orgIndustry", restorable.orgIndustry, {
                shouldDirty: false,
                shouldValidate: false,
                shouldTouch: false,
              });
            }
          });
        }

        if (draftRecord.key !== draftStorageKey) {
          localStorage.setItem(
            draftStorageKey,
            JSON.stringify(
              buildStoredDraftPayload(normalizedValues, {
                step: restoredStep,
                savedAt: draftRecord.savedAt || Date.now(),
              }),
            ),
          );
          localStorage.removeItem(draftRecord.key);
          notifyOrgDraftUpdated(formId, userId);
        }

        if (typeof onRestoreStep === "function") {
          onRestoreStep(restoredStep);
        }
      }

      // Restore logo from separate storage
      const savedLogoEntry = getFirstStoredValue(logoReadKeys);
      if (savedLogoEntry?.value) {
        const logoData = JSON.parse(savedLogoEntry.value);
        const file = base64ToFile(logoData);
        if (file) {
          setValue("orgLogo", file, { shouldValidate: false });

          if (savedLogoEntry.key !== logoStorageKey) {
            localStorage.setItem(logoStorageKey, savedLogoEntry.value);
            localStorage.removeItem(savedLogoEntry.key);
          }
        }
      }
    } catch (error) {
      console.warn("Failed to restore form data:", error);
    } finally {
      initialLoadDone.current = true;
      // Reset skip flag after a short delay to allow RHF to finish its batching
      setTimeout(() => {
        skipNextSave.current = false;
      }, 100);
    }
  }, [
    isEnabled,
    reset,
    getValues,
    setValue,
    draftStorageKey,
    logoStorageKey,
    logoReadKeys,
    formId,
    userId,
    maxStep,
    onRestoreStep,
  ]);

  // Save data on changes (debounced)
  useEffect(() => {
    if (!isEnabled) return;

    const saveToLocalStorage = async (snapshot) => {
      if (!initialLoadDone.current || skipNextSave.current) return;

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const allData = snapshot || getValues();
          const { orgLogo, ...serializable } = allData;
          const normalizedSerializable = normalizeDraftValues(serializable);

          // Crucial: Only save if we actually have data, prevent saving defaults over draft
          // And double check skipNextSave here in case it changed during the debounce
          if (
            hasMeaningfulDraftContent(normalizedSerializable) &&
            !skipNextSave.current
          ) {
            localStorage.setItem(
              draftStorageKey,
              JSON.stringify(
                buildStoredDraftPayload(normalizedSerializable, {
                  step: normalizeDraftStep(currentStep, maxStep),
                }),
              ),
            );

            draftReadKeys
              .filter((key) => key !== draftStorageKey)
              .forEach((key) => localStorage.removeItem(key));

            notifyOrgDraftUpdated(formId, userId);
          } else {
            localStorage.removeItem(draftStorageKey);
            notifyOrgDraftUpdated(formId, userId);
          }

          // Handle logo separately
          if (orgLogo instanceof File) {
            const logoBase64 = await fileToBase64(orgLogo);
            localStorage.setItem(logoStorageKey, JSON.stringify(logoBase64));

            logoReadKeys
              .filter((key) => key !== logoStorageKey)
              .forEach((key) => localStorage.removeItem(key));
          } else if (!orgLogo) {
            logoReadKeys.forEach((key) => localStorage.removeItem(key));
          }
        } catch (error) {
          console.warn("Failed to save draft:", error);
        }
      }, DEBOUNCE_MS);
    };

    const subscription = watch((value, { type }) => {
      // Don't save if it's just a focus event or similar
      if (type === "change" || type === undefined) {
        saveToLocalStorage(value);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [
    watch,
    getValues,
    isEnabled,
    draftStorageKey,
    logoStorageKey,
    draftReadKeys,
    logoReadKeys,
    formId,
    userId,
    currentStep,
    maxStep,
  ]);

  // Save step changes even when no field value changed (e.g., clicking Next/Previous).
  useEffect(() => {
    if (
      !isEnabled ||
      !initialLoadDone.current ||
      !Number.isFinite(currentStep)
    ) {
      return;
    }

    try {
      const allData = getValues();
      const { orgLogo, ...serializable } = allData;
      const normalizedSerializable = normalizeDraftValues(serializable);

      if (!hasMeaningfulDraftContent(normalizedSerializable)) {
        return;
      }

      localStorage.setItem(
        draftStorageKey,
        JSON.stringify(
          buildStoredDraftPayload(normalizedSerializable, {
            step: normalizeDraftStep(currentStep, maxStep),
          }),
        ),
      );
      notifyOrgDraftUpdated(formId, userId);
    } catch (error) {
      console.warn("Failed to save draft step:", error);
    }
  }, [
    currentStep,
    maxStep,
    isEnabled,
    getValues,
    draftStorageKey,
    formId,
    userId,
  ]);

  const clearSavedData = useCallback(() => {
    try {
      draftReadKeys.forEach((key) => localStorage.removeItem(key));
      logoReadKeys.forEach((key) => localStorage.removeItem(key));
      notifyOrgDraftUpdated(formId, userId);
    } catch (error) {
      console.warn("Failed to clear saved form data:", error);
    }
  }, [draftReadKeys, logoReadKeys, formId, userId]);

  const hasSavedData = useCallback(() => {
    try {
      return Boolean(
        findOrgDraftRecord({
          formId,
          userId,
          cleanupExpired: true,
        }),
      );
    } catch {
      return false;
    }
  }, [formId, userId]);

  return { clearSavedData, hasSavedData };
}
