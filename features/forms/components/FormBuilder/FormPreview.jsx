"use client";
import { useState } from "react";

const FIELD_TYPE_PLACEHOLDER = {
  text: "اكتب الإجابة هنا",
  textarea: "اكتب إجابتك التفصيلية هنا",
  number: "أدخل رقماً",
  email: "name@example.com",
};

export function FormPreview({ title, description, fields }) {
  const [previewValues, setPreviewValues] = useState({});

  const handlePreviewChange = (fieldKey, value) => {
    setPreviewValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  return (
    <div className="bg-white border rounded-lg p-6" dir="rtl">
      <h2 className="text-2xl font-bold mb-2">{title || "نموذج بدون عنوان"}</h2>
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      {fields.map((field) => (
        <div key={field._key} className="mb-4">
          <label className="block font-medium mb-2">
            {field.label || "حقل بدون عنوان"}
            {field.required && <span className="text-red-500 me-1">*</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              placeholder={field.placeholder || FIELD_TYPE_PLACEHOLDER.text}
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {field.type === "textarea" && (
            <textarea
              placeholder={field.placeholder || FIELD_TYPE_PLACEHOLDER.textarea}
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          )}

          {field.type === "number" && (
            <input
              type="number"
              placeholder={field.placeholder || FIELD_TYPE_PLACEHOLDER.number}
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {field.type === "email" && (
            <input
              type="email"
              placeholder={field.placeholder || FIELD_TYPE_PLACEHOLDER.email}
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          )}

          {field.type === "dropdown" && (
            <select
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
            >
              <option value="">اختر خياراً</option>
              {(field.options || []).map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}

          {field.type === "multipleChoice" && (
            <div className="space-y-2">
              {(field.options || []).map((option, i) => (
                <label
                  key={i}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={(previewValues[field._key] || []).includes(option)}
                    onChange={(e) => {
                      const current = previewValues[field._key] || [];
                      const newValue = e.target.checked
                        ? [...current, option]
                        : current.filter((v) => v !== option);
                      handlePreviewChange(field._key, newValue);
                    }}
                    className="w-4 h-4"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {field.type === "date" && (
            <input
              type="date"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
            />
          )}

          {field.type === "time" && (
            <input
              type="time"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
            />
          )}

          {field.type === "datetime" && (
            <input
              type="datetime-local"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={previewValues[field._key] || ""}
              onChange={(e) => handlePreviewChange(field._key, e.target.value)}
            />
          )}

          {field.type === "file" && (
            <div>
              <input
                type="file"
                accept={
                  field.fileType === "image"
                    ? "image/*"
                    : field.fileType === "document"
                      ? ".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                      : undefined
                }
                className="w-full border rounded-lg p-2"
                onChange={(e) =>
                  handlePreviewChange(field._key, e.target.files[0]?.name || "")
                }
              />
              {field.fileType === "image" && (
                <p className="text-xs text-gray-500 mt-1">
                  الملفات المسموح بها: صور فقط
                </p>
              )}
              {field.fileType === "document" && (
                <p className="text-xs text-gray-500 mt-1">
                  الملفات المسموح بها: PDF وWord وExcel وPowerPoint وText
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
