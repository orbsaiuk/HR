"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ORG_DRAFT_MAX_AGE_MS,
  ORG_DRAFT_STORAGE_EVENT,
  ORG_REGISTRATION_FORM_ID,
  buildOrgDraftKey,
  findOrgDraftRecord,
  formatDraftAge,
  notifyOrgDraftUpdated,
} from "./orgDraftStorage";

export function useHasDraft({
  formId = ORG_REGISTRATION_FORM_ID,
  userId,
  maxAgeMs = ORG_DRAFT_MAX_AGE_MS,
  enabled = true,
} = {}) {
  const [state, setState] = useState({
    hasDraft: false,
    draftAge: null,
  });

  const evaluateDraft = useCallback(() => {
    if (typeof window === "undefined" || !enabled || !userId) {
      setState({ hasDraft: false, draftAge: null });
      return;
    }

    const draftRecord = findOrgDraftRecord({
      formId,
      userId,
      maxAgeMs,
      cleanupExpired: true,
    });

    if (!draftRecord) {
      setState({ hasDraft: false, draftAge: null });
      return;
    }

    const primaryKey = buildOrgDraftKey(formId, userId);

    // Promote legacy keys to the user-scoped key once discovered.
    if (draftRecord.key !== primaryKey) {
      localStorage.setItem(
        primaryKey,
        JSON.stringify({
          values: draftRecord.values,
          step: draftRecord.step,
          savedAt: draftRecord.savedAt || Date.now(),
        }),
      );
      localStorage.removeItem(draftRecord.key);
      notifyOrgDraftUpdated(formId, userId);
    }

    setState({
      hasDraft: true,
      draftAge: formatDraftAge(draftRecord.savedAt),
    });
  }, [enabled, formId, maxAgeMs, userId]);

  useEffect(() => {
    evaluateDraft();
  }, [evaluateDraft]);

  useEffect(() => {
    if (!enabled || !userId || typeof window === "undefined") {
      return undefined;
    }

    const onStorage = (event) => {
      if (!event.key) return;

      // Ignore unrelated storage writes to avoid unnecessary renders.
      if (!event.key.includes(formId) && !event.key.includes("org-registration-draft")) {
        return;
      }

      evaluateDraft();
    };

    const onDraftUpdated = (event) => {
      const detail = event.detail || {};

      if (
        detail.formId &&
        detail.formId !== formId &&
        detail.formId !== ORG_REGISTRATION_FORM_ID
      ) {
        return;
      }

      if (detail.userId && detail.userId !== userId) {
        return;
      }

      evaluateDraft();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(ORG_DRAFT_STORAGE_EVENT, onDraftUpdated);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(ORG_DRAFT_STORAGE_EVENT, onDraftUpdated);
    };
  }, [enabled, evaluateDraft, formId, userId]);

  return state;
}
