"use client";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

const FIELD_TYPE_LABELS = {
  text: "نص قصير",
  textarea: "نص طويل",
  number: "رقم",
  email: "بريد إلكتروني",
  multipleChoice: "اختيار متعدد",
  dropdown: "قائمة منسدلة",
  date: "تاريخ",
  time: "وقت",
  datetime: "تاريخ ووقت",
  file: "رفع ملف",
};

function SortableFieldCard({ field, index, canReorder, onEditField, onDeleteField }) {
  const hasOptions =
    ["multipleChoice", "dropdown"].includes(field.type) &&
    (field.options || []).filter(Boolean).length > 0;
  const hasDetails = hasOptions;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field._key, disabled: !canReorder });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-slate-300 hover:shadow-md ${
        isDragging ? "z-10 opacity-70 ring-4 ring-[#4B2EE8]/10" : ""
      }`}
    >
      <div className={`flex gap-3 ${hasDetails ? "items-start" : "items-center"}`}>
        <div className={`flex items-center gap-2 text-slate-400 ${hasDetails ? "mt-1" : ""}`}>
          {canReorder && (
            <button
              type="button"
              className="cursor-grab touch-none active:cursor-grabbing"
              aria-label="سحب لترتيب السؤال"
              {...attributes}
              {...listeners}
            >
              <GripVertical size={16} />
            </button>
          )}
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#4B2EE8]/10 text-xs font-bold text-[#4B2EE8]">
            {index + 1}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="truncate font-semibold text-slate-900">
              {field.label || `سؤال ${index + 1}`}
            </h4>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              {FIELD_TYPE_LABELS[field.type] || field.type}
            </span>
            {field.required && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                مطلوب
              </span>
            )}
          </div>

          {hasOptions && (
            <div className="mt-3 flex flex-wrap gap-2">
              {(field.options || []).filter(Boolean).map((option) => (
                <span
                  key={option}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
                >
                  {option}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={() => onEditField(field)}
            className="cursor-pointer rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="تعديل السؤال"
            type="button"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDeleteField(field._key)}
            className="cursor-pointer rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
            aria-label="حذف السؤال"
            type="button"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function FieldList({
  fields,
  canReorder = false,
  onAddField,
  onEditField,
  onDeleteField,
}) {
  if (fields.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-10 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B2EE8]/10 text-lg font-bold text-[#4B2EE8]">
          +
        </div>
        <p className="font-semibold text-slate-700">لا توجد أسئلة بعد</p>
        <Button
          type="button"
          onClick={onAddField}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 bg-[#4B2EE8] hover:bg-[#462EA8]"
        >
          <Plus size={16} />
          إضافة سؤال
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <SortableFieldCard
          key={field._key}
          field={field}
          index={index}
          canReorder={canReorder}
          onEditField={onEditField}
          onDeleteField={onDeleteField}
        />
      ))}
    </div>
  );
}
