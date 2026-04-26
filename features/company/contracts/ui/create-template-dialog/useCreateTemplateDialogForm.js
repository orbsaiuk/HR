"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { contractsApi } from "../../api/contractsApi";
import {
  templateFormDefaults,
  templateFormSchema,
} from "../../model/contractSchema";
import { getDefaultClausesForType } from "./templateClauseDefaults";

export function useCreateTemplateDialogForm({
  open,
  onOpenChange,
  onTemplateCreated,
}) {
  const {
    register,
    control,
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(templateFormSchema),
    defaultValues: templateFormDefaults,
    mode: "onTouched",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "clauses",
  });

  const selectedType = watch("type") || templateFormDefaults.type;

  useEffect(() => {
    if (!open) return;

    const initialType = templateFormDefaults.type;
    reset({
      ...templateFormDefaults,
      type: initialType,
      clauses: getDefaultClausesForType(initialType),
    });
  }, [open, reset]);

  function handleTypeChange(nextType) {
    setValue("type", nextType, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    replace(getDefaultClausesForType(nextType));
  }

  function handleDialogChange(nextOpen) {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      reset(templateFormDefaults);
    }
  }

  async function onSubmit(values) {
    const createdTemplate = await contractsApi.createTemplate(values);
    onTemplateCreated?.(createdTemplate);
    handleDialogChange(false);
  }

  return {
    register,
    errors,
    isSubmitting,
    selectedType,
    fields,
    append,
    remove,
    handleTypeChange,
    handleDialogChange,
    handleSubmitForm: handleSubmit(onSubmit),
  };
}
