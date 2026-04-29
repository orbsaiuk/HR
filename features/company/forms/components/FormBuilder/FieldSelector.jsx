"use client";

import {
  AlignLeft,
  AtSign,
  Calendar,
  CheckSquare,
  ChevronDownSquare,
  Clock,
  FileUp,
  Hash,
  Type,
} from "lucide-react";

const fieldTypes = [
  { type: "text", label: "نص قصير", description: "إجابة من سطر واحد", icon: Type },
  { type: "textarea", label: "نص طويل", description: "إجابة تفصيلية", icon: AlignLeft },
  { type: "number", label: "رقم", description: "قيمة رقمية", icon: Hash },
  { type: "email", label: "بريد إلكتروني", description: "عنوان بريد", icon: AtSign },
  {
    type: "multipleChoice",
    label: "اختيار متعدد",
    description: "أكثر من خيار",
    icon: CheckSquare,
  },
  { type: "dropdown", label: "قائمة منسدلة", description: "اختيار واحد", icon: ChevronDownSquare },
  { type: "date", label: "تاريخ", description: "اختيار تاريخ", icon: Calendar },
  { type: "time", label: "وقت", description: "اختيار وقت", icon: Clock },
  { type: "datetime", label: "تاريخ ووقت", description: "موعد كامل", icon: Calendar },
  { type: "file", label: "رفع ملف", description: "إرفاق مستند", icon: FileUp },
];

export function FieldSelector({ onAddField }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">إضافة سؤال</h3>
        <p className="mt-1 text-xs text-slate-500">
          اختر نوع السؤال لإضافته إلى النموذج.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {fieldTypes.map((field) => (
          <button
            key={field.type}
            onClick={() => onAddField(field.type)}
            className="group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-right transition-all hover:border-[#4B2EE8]/40 hover:bg-[#4B2EE8]/5 hover:shadow-sm"
            type="button"
          >
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-[#4B2EE8]/10 group-hover:text-[#4B2EE8]">
              <field.icon size={17} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                {field.label}
              </span>
              <span className="mt-0.5 block text-xs text-slate-500">
                {field.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
