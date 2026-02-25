/**
 * Form edit page component
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useFormEdit } from "../model/useFormEdit";
import { FormBuilder } from "../components/FormBuilder/FormBuilder";
import { Loading } from "@/shared/components/feedback/Loading";
import { AssignedTeamMembersField } from "@/shared/components/forms/AssignedTeamMembersField";

export function FormEditPage({ formId }) {
  const router = useRouter();
  const {
    title,
    setTitle,
    description,
    setDescription,
    fields,
    setFields,
    assignedTo,
    setAssignedTo,
    loading,
    savingDraft,
    error,
    saveForm,
  } = useFormEdit(formId);

  const handleSave = async () => {
    const result = await saveForm(false);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading) return <Loading fullPage />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
            <p className="text-gray-600 mt-1">
              Update your form fields and settings
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={savingDraft}
            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
          >
            <Save size={20} />
            {savingDraft ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Form Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <FormBuilder
          title={title}
          description={description}
          fields={fields}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFieldsChange={setFields}
        />
      </div>

      {/* Assigned Team Members */}
      <AssignedTeamMembersField
        value={assignedTo}
        onChange={setAssignedTo}
      />
    </div>
  );
}
