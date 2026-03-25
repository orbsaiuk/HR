"use client";

import { useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "org-registration-draft";
const LOGO_STORAGE_KEY = "org-registration-draft-logo";
const DEBOUNCE_MS = 500;

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
export function useOrgFormPersistence(methods, isEnabled = true) {
  const { watch, reset, getValues, setValue } = methods;
  const debounceRef = useRef(null);
  const initialLoadDone = useRef(false);

  // Load saved data on mount
  useEffect(() => {
    if (!isEnabled || initialLoadDone.current) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude orgLogo - we'll handle it separately
        const { orgLogo, ...restorable } = parsed;
        reset({ ...getValues(), ...restorable });
      }

      // Restore logo from separate storage
      const savedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
      if (savedLogo) {
        const logoData = JSON.parse(savedLogo);
        const file = base64ToFile(logoData);
        if (file) {
          setValue("orgLogo", file, { shouldValidate: false });
        }
      }
    } catch (error) {
      console.warn("Failed to restore form data:", error);
    }

    initialLoadDone.current = true;
  }, [isEnabled, reset, getValues, setValue]);

  // Save data on changes (debounced)
  useEffect(() => {
    if (!isEnabled) return;

    const subscription = watch(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        try {
          // Use getValues() to get ALL form data, not just changed fields
          const allData = getValues();
          const { orgLogo, ...serializable } = allData;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));

          // Handle logo separately
          if (orgLogo instanceof File) {
            const logoBase64 = await fileToBase64(orgLogo);
            localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(logoBase64));
          } else if (!orgLogo) {
            localStorage.removeItem(LOGO_STORAGE_KEY);
          }
        } catch (error) {
          console.warn("Failed to save form data:", error);
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [watch, getValues, isEnabled]);

  const clearSavedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOGO_STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear saved form data:", error);
    }
  }, []);

  const hasSavedData = useCallback(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }, []);

  return { clearSavedData, hasSavedData };
}
