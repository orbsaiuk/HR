"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ALLOWED_PORTFOLIO_IMAGE_TYPES,
  MAX_PORTFOLIO_IMAGE_SIZE,
} from "../lib/freelancerProfileEditHelpers";

export function usePortfolioFiles({ clearErrors, setError } = {}) {
  const [filesById, setFilesById] = useState({});
  const [previewsById, setPreviewsById] = useState({});

  const clearRow = useCallback((fieldId) => {
    if (!fieldId) return;

    setFilesById((prev) => {
      if (!prev[fieldId]) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });

    setPreviewsById((prev) => {
      const previewUrl = prev[fieldId];
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (!previewUrl) return prev;

      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setFilesById({});
    setPreviewsById((prev) => {
      Object.values(prev).forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      );
      return {};
    });
  }, []);

  useEffect(
    () => () => {
      clearAll();
    },
    [clearAll],
  );

  const handleFileChange = useCallback(
    (fieldId, index, file) => {
      const errorPath = `portfolioProjects.${index}.image`;
      clearErrors?.(errorPath);
      clearRow(fieldId);

      if (!file) {
        return;
      }

      if (!ALLOWED_PORTFOLIO_IMAGE_TYPES.includes(file.type)) {
        setError?.(errorPath, {
          type: "manual",
          message: "الصيغ المدعومة: JPG و PNG و WEBP و GIF.",
        });
        return;
      }

      if (file.size > MAX_PORTFOLIO_IMAGE_SIZE) {
        setError?.(errorPath, {
          type: "manual",
          message: "حجم الصورة يجب ألا يتجاوز 5MB.",
        });
        return;
      }

      setFilesById((prev) => ({ ...prev, [fieldId]: file }));
      setPreviewsById((prev) => ({
        ...prev,
        [fieldId]: URL.createObjectURL(file),
      }));
    },
    [clearErrors, clearRow, setError],
  );

  const handleProjectRemove = useCallback(
    (_index, fieldId) => {
      clearRow(fieldId);
    },
    [clearRow],
  );

  return {
    filesById,
    previewsById,
    handleFileChange,
    handleProjectRemove,
    clearAll,
  };
}
