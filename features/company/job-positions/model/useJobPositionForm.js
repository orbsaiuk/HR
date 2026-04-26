"use client";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function useJobPositionForm({ schema, defaultValues }) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { watch, getValues, setValue, register } = methods;

  const formData = watch();

  const updateFormData = useCallback(
    (nextData) => {
      const currentData = getValues();

      Object.entries(nextData || {}).forEach(([key, value]) => {
        if (currentData[key] === value) return;

        setValue(key, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false,
        });
      });
    },
    [getValues, setValue],
  );

  useEffect(() => {
    Object.keys(defaultValues || {}).forEach((fieldName) => {
      register(fieldName);
    });
  }, [defaultValues, register]);

  return {
    methods,
    formData,
    updateFormData,
  };
}
