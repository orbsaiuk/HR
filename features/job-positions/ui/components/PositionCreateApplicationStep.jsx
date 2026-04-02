"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationMethodSelector } from "./ApplicationMethodSelector";
import { ApplicationFormSection } from "../ApplicationFormSection";

export function PositionCreateApplicationStep({
  formData,
  onChange,
  formMode,
  onFormModeChange,
  newForm,
  onNewFormChange,
}) {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle>اعدادات التقديم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <ApplicationMethodSelector
          value={formData.applicationMethod}
          onChange={(val) => onChange({ ...formData, applicationMethod: val })}
        />

        {(formData.applicationMethod === "form" ||
          formData.applicationMethod === "both") && (
          <ApplicationFormSection
            formId={formData.formId}
            onFormIdChange={(id) => onChange({ ...formData, formId: id })}
            newForm={newForm}
            onNewFormChange={onNewFormChange}
            mode={formMode}
            onModeChange={onFormModeChange}
            showDeadline={false}
          />
        )}

        {formData.applicationMethod === "profile" && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-5 text-center">
            <p className="text-sm text-muted-foreground">
              سيقوم المتقدمون بالتقديم عبر ملفهم الشخصي فقط دون نموذج مخصص.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
