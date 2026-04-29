"use client";

import { Plus, Settings2, X } from "lucide-react";

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

export function FieldEditor({ field, onUpdate }) {
  const isChoiceField = ["multipleChoice", "dropdown"].includes(field.type);
  const isFileField = field.type === "file";

  const handleOptionChange = (index, value) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(field.options || []), ""];
    onUpdate({ options: newOptions });
  };

  const handleRemoveOption = (index) => {
    const newOptions = (field.options || []).filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  const requiredFieldId = `required-${field._key || "field"}`;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">إعدادات السؤال</h3>
          <p className="mt-1 text-xs text-slate-500">
            {FIELD_TYPE_LABELS[field.type] || field.type}
          </p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4B2EE8]/10 text-[#4B2EE8]">
          <Settings2 size={17} />
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            عنوان السؤال
          </label>
          <input
            type="text"
            value={field.label}
            onChange={(e) => onUpdate({ label: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-[#4B2EE8] focus:ring-4 focus:ring-[#4B2EE8]/10"
            placeholder="اكتب عنوان السؤال"
          />
          {!field.label?.trim() && (
            <p className="mt-1.5 text-xs text-red-500">العنوان مطلوب قبل الحفظ.</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            النص التوضيحي
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-[#4B2EE8] focus:ring-4 focus:ring-[#4B2EE8]/10"
            placeholder="مثال: اكتب إجابتك هنا"
          />
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          <span>
            <span className="block text-sm font-semibold text-slate-800">
              سؤال مطلوب
            </span>
            <span className="text-xs text-slate-500">
              لن يستطيع المستخدم الإرسال بدون إجابة.
            </span>
          </span>
          <input
            type="checkbox"
            checked={field.required}
            onChange={(e) => onUpdate({ required: e.target.checked })}
            className="h-4 w-4 cursor-pointer accent-[#4B2EE8]"
            id={requiredFieldId}
          />
        </label>

        {isFileField && (
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              نوع الملف
            </label>
            <select
              value={field.fileType || "any"}
              onChange={(e) => onUpdate({ fileType: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none transition focus:border-[#4B2EE8] focus:ring-4 focus:ring-[#4B2EE8]/10"
            >
              <option value="any">أي ملف</option>
              <option value="image">صور فقط</option>
              <option value="document">مستندات فقط</option>
            </select>
          </div>
        )}

        {isChoiceField && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-slate-700">
                الخيارات
              </label>
              {!(field.options || []).some((option) => option.trim()) && (
                <span className="text-xs text-red-500">أضف خياراً واحداً على الأقل</span>
              )}
            </div>
            <div className="space-y-2">
              {(field.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white p-2.5 text-sm outline-none transition focus:border-[#4B2EE8] focus:ring-4 focus:ring-[#4B2EE8]/10"
                    placeholder={`الخيار ${index + 1}`}
                  />
                  {(field.options || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
                      aria-label="حذف الخيار"
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#4B2EE8]/40 bg-[#4B2EE8]/5 px-3 py-2.5 text-sm font-semibold text-[#4B2EE8] transition-colors hover:bg-[#4B2EE8]/10"
              >
                <Plus size={16} />
                إضافة خيار
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
