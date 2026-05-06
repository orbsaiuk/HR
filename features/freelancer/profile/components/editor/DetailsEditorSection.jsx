"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";

export function DetailsEditorSection() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input id="phone" dir="ltr" {...register("phone")} />
      </div>
    </div>
  );
}
