"use client";

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

export function FieldList({
  fields,
  onSelectField,
  selectedFieldKey,
  onDeleteField,
}) {
  if (fields.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-500 text-center">
          لا توجد حقول حتى الآن. أضف حقلاً للبدء.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg">حقول النموذج</h3>
      {fields.map((field, index) => (
        <div
          key={field._key}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedFieldKey === field._key
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onSelectField(field)}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">
                {field.label || `الحقل ${index + 1}`}
              </div>
              <div className="text-sm text-gray-500">
                {FIELD_TYPE_LABELS[field.type] || field.type}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteField(field._key);
              }}
              className="text-red-500 hover:text-red-700 transition-colors"
              aria-label="حذف الحقل"
            >
              حذف
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
