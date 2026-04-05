"use client";

const fieldTypes = [
  { type: "text", label: "نص قصير", description: "إدخال نص قصير" },
  { type: "textarea", label: "نص طويل", description: "إدخال نص متعدد الأسطر" },
  { type: "number", label: "رقم", description: "إدخال قيمة رقمية" },
  { type: "email", label: "بريد إلكتروني", description: "إدخال عنوان بريد" },
  {
    type: "multipleChoice",
    label: "اختيار متعدد",
    description: "تحديد أكثر من خيار",
  },
  { type: "dropdown", label: "قائمة منسدلة", description: "اختيار من قائمة" },
  { type: "date", label: "تاريخ", description: "منتقي تاريخ" },
  { type: "time", label: "وقت", description: "منتقي وقت" },
  { type: "datetime", label: "تاريخ ووقت", description: "تحديد تاريخ ووقت" },
  { type: "file", label: "رفع ملف", description: "إرفاق ملفات" },
];

export function FieldSelector({ onAddField }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">إضافة حقل</h3>
      <div className="grid grid-cols-2 gap-2">
        {fieldTypes.map((field) => (
          <button
            key={field.type}
            onClick={() => onAddField(field.type)}
            className="cursor-pointer rounded-lg border p-3 text-right transition-colors hover:bg-gray-50"
          >
            <div className="font-medium">{field.label}</div>
            <div className="text-sm text-gray-500">{field.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
