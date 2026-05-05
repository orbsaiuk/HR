"use client";

import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { TagInput } from "../shared/TagInput";

export function SkillsEditorSection() {
  const { control } = useFormContext();

  return (
    <div className="space-y-2">
      <Label htmlFor="skills">المهارات</Label>
      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <TagInput
            id="skills"
            values={field.value || []}
            onChange={field.onChange}
            placeholder="اكتب مهارة ثم اضغط Enter"
            ariaLabel="المهارات"
          />
        )}
      />
      <p className="text-xs text-slate-400">
        اكتب مهارة ثم اضغط Enter أو فاصلة.
      </p>
    </div>
  );
}
