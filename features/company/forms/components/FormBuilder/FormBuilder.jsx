"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldDialog, createEmptyField } from "./FieldDialog";
import { FieldList } from "./FieldList";

export function FormBuilder({
  title,
  description,
  fields,
  onTitleChange,
  onDescriptionChange,
  onFieldsChange,
  showMetadata = true,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const [draftField, setDraftField] = useState(null);
  const canReorder = fields.length > 1;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const openAddDialog = () => {
    setDialogMode("add");
    setDraftField(createEmptyField(fields.length));
    setDialogOpen(true);
  };

  const openEditDialog = (field) => {
    setDialogMode("edit");
    setDraftField({
      ...field,
      options: field.options ? [...field.options] : undefined,
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDraftField(null);
  };

  const saveDialogField = () => {
    if (!draftField) return;

    const sanitizedField = {
      ...draftField,
      label: draftField.label.trim(),
      placeholder: draftField.placeholder?.trim() || "",
      ...(Array.isArray(draftField.options)
        ? {
            options: draftField.options
              .map((option) => option.trim())
              .filter(Boolean),
          }
        : {}),
    };

    if (dialogMode === "edit") {
      onFieldsChange(
        fields.map((field) =>
          field._key === sanitizedField._key ? sanitizedField : field,
        ),
      );
      toast.success("تم تعديل السؤال بنجاح");
    } else {
      onFieldsChange([...fields, sanitizedField]);
      toast.success("تم إضافة السؤال بنجاح");
    }

    closeDialog();
  };

  const deleteField = (key) => {
    onFieldsChange(
      fields
        .filter((field) => field._key !== key)
        .map((field, index) => ({ ...field, order: index })),
    );
    toast.success("تم حذف السؤال");
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field._key === active.id);
    const newIndex = fields.findIndex((field) => field._key === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    onFieldsChange(
      arrayMove(fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        order: index,
      })),
    );
  };

  return (
    <div className="space-y-5" dir="rtl">
      <main className="mx-auto max-w-4xl space-y-5">
        {showMetadata && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <input
              type="text"
              placeholder="عنوان النموذج"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              className="w-full border-0 border-b border-slate-200 bg-transparent pb-3 text-2xl font-bold text-slate-900 outline-none transition focus:border-[#4B2EE8]"
            />
            <textarea
              placeholder="وصف النموذج"
              value={description}
              onChange={(event) => onDescriptionChange(event.target.value)}
              className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 outline-none transition focus:border-[#4B2EE8] focus:ring-4 focus:ring-[#4B2EE8]/10"
              rows={3}
            />
          </div>
        )}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                أسئلة النموذج
              </h3>
              <p className="text-xs text-slate-500">
                {fields.length} سؤال في هذا النموذج
              </p>
            </div>

            {fields.length > 0 && (
              <Button type="button" variant="outline" onClick={openAddDialog}>
                <Plus size={16} className="ms-1" />
                إضافة سؤال
              </Button>
            )}
          </div>

          {canReorder ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field._key)}
                strategy={verticalListSortingStrategy}
              >
                <FieldList
                  fields={fields}
                  canReorder={canReorder}
                  onAddField={openAddDialog}
                  onEditField={openEditDialog}
                  onDeleteField={deleteField}
                />
              </SortableContext>
            </DndContext>
          ) : (
            <FieldList
              fields={fields}
              canReorder={false}
              onAddField={openAddDialog}
              onEditField={openEditDialog}
              onDeleteField={deleteField}
            />
          )}
        </section>
      </main>

      <FieldDialog
        open={dialogOpen}
        mode={dialogMode}
        field={draftField}
        onChange={setDraftField}
        onClose={closeDialog}
        onSave={saveDialogField}
      />

    </div>
  );
}
