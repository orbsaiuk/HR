"use client";

import { ApplicationMethodSelector } from "./ApplicationMethodSelector";
import { ApplicationFormSection } from "../ApplicationFormSection";

export function PositionEditApplicationStep({
  formData,
  onChange,
  formMode,
  onFormModeChange,
  newForm,
  onNewFormChange,
}) {
  return (
    <div className="space-y-6">
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
          deadline={formData.deadline}
          onDeadlineChange={(val) => onChange({ ...formData, deadline: val })}
        />
      )}

      {formData.applicationMethod === "profile" && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 bg-gray-50/50 text-center">
          <p className="text-sm text-muted-foreground">
            سيقوم المتقدمون بإرسال ملفهم الشخصي عند التقديم. لا حاجة لنموذج
            تقديم.
          </p>
        </div>
      )}
    </div>
  );
}
