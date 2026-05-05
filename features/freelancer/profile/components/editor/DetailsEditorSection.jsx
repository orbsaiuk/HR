"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import { TagInput } from "../shared/TagInput";

export function DetailsEditorSection() {
  const { control, register } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input id="phone" dir="ltr" {...register("phone")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="languages">اللغات</Label>
        <Controller
          name="languages"
          control={control}
          render={({ field }) => (
            <TagInput
              id="languages"
              values={field.value || []}
              onChange={field.onChange}
              placeholder="اكتب لغة ثم اضغط Enter"
              ariaLabel="اللغات"
            />
          )}
        />
        <p className="text-xs text-slate-400">
          اضغط Enter أو فاصلة لإضافة لغة جديدة.
        </p>
      </div>
    </div>
  );
}
