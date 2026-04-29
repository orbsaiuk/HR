"use client";

import { Plus, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FIELD_TYPES = [
  { value: "text", label: "نص قصير" },
  { value: "textarea", label: "نص طويل" },
  { value: "number", label: "رقم" },
  { value: "email", label: "بريد إلكتروني" },
  { value: "multipleChoice", label: "اختيار متعدد" },
  { value: "dropdown", label: "قائمة منسدلة" },
  { value: "date", label: "تاريخ" },
  { value: "time", label: "وقت" },
  { value: "datetime", label: "تاريخ ووقت" },
  { value: "file", label: "رفع ملف" },
];

const CHOICE_TYPES = new Set(["multipleChoice", "dropdown"]);
const PLACEHOLDER_TYPES = new Set(["text", "textarea", "number", "email"]);

function normalizeDraftForType(draft, type) {
  return {
    ...draft,
    type,
    ...(CHOICE_TYPES.has(type)
      ? { options: draft.options?.length ? draft.options : [""] }
      : {}),
    ...(type === "file" ? { fileType: draft.fileType || "any" } : {}),
  };
}

export function createEmptyField(order = 0) {
  return {
    _key: `field-${Date.now()}`,
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    order,
  };
}

export function FieldDialog({ open, mode, field, onChange, onClose, onSave }) {
  if (!field) return null;

  const isChoiceField = CHOICE_TYPES.has(field.type);
  const isFileField = field.type === "file";
  const canSave =
    field.label?.trim() &&
    (!isChoiceField || (field.options || []).some((option) => option.trim()));

  const updateField = (updates) => {
    onChange({ ...field, ...updates });
  };

  const updateType = (type) => {
    onChange(normalizeDraftForType(field, type));
  };

  const updateOption = (index, value) => {
    const options = [...(field.options || [])];
    options[index] = value;
    updateField({ options });
  };

  const addOption = () => {
    updateField({ options: [...(field.options || []), ""] });
  };

  const removeOption = (index) => {
    updateField({ options: (field.options || []).filter((_, i) => i !== index) });
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto text-right sm:max-w-2xl [&>button]:left-4 [&>button]:right-auto"
        dir="rtl"
      >
        <DialogHeader className="items-start space-y-2 text-right sm:text-right">
          <DialogTitle>
            {mode === "edit" ? "تعديل السؤال" : "إضافة سؤال جديد"}
          </DialogTitle>
          <DialogDescription>
            اختر نوع السؤال أولاً، ثم ستظهر الحقول المناسبة لهذا النوع.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
              نوع السؤال
            </Label>
            <Select value={field.type} onValueChange={updateType} dir="rtl">
              <SelectTrigger className="h-11 rounded-xl border-slate-300 text-right focus:ring-[#4B2EE8]/20">
                <SelectValue placeholder="اختر نوع السؤال" />
              </SelectTrigger>
              <SelectContent align="start" dir="rtl">
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-right">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
              عنوان السؤال
            </Label>
            <Input
              type="text"
              value={field.label || ""}
              onChange={(event) => updateField({ label: event.target.value })}
              className="h-11 rounded-xl border-slate-300 text-right focus-visible:ring-[#4B2EE8]/20"
              placeholder="مثال: ما هو نطاق المشروع؟"
            />
            {!field.label?.trim() && (
              <p className="mt-1 text-xs text-red-500">عنوان السؤال مطلوب.</p>
            )}
          </div>

          {PLACEHOLDER_TYPES.has(field.type) && (
            <div>
              <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
                النص التوضيحي
              </Label>
              <Input
                type="text"
                value={field.placeholder || ""}
                onChange={(event) => updateField({ placeholder: event.target.value })}
                className="h-11 rounded-xl border-slate-300 text-right focus-visible:ring-[#4B2EE8]/20"
                placeholder="مثال: اكتب إجابتك هنا"
              />
            </div>
          )}

          {isChoiceField && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <Label className="block text-sm font-semibold text-slate-700">
                  الخيارات
                </Label>
                {!(field.options || []).some((option) => option.trim()) && (
                  <Badge variant="destructive" className="text-xs">
                    أضف خياراً واحداً على الأقل
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {(field.options || []).map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg px-0 text-xs font-semibold"
                    >
                      {index + 1}
                    </Badge>
                    <Input
                      type="text"
                      value={option}
                      onChange={(event) => updateOption(index, event.target.value)}
                      className="min-w-0 flex-1 rounded-xl border-slate-300 text-right focus-visible:ring-[#4B2EE8]/20"
                      placeholder={`الخيار ${index + 1}`}
                    />
                    {(field.options || []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        aria-label="حذف الخيار"
                      >
                        <X size={17} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-dashed border-[#4B2EE8]/40 bg-[#4B2EE8]/5 text-[#4B2EE8] hover:bg-[#4B2EE8]/10 hover:text-[#4B2EE8]"
                >
                  <Plus size={16} />
                  إضافة خيار
                </Button>
              </div>
            </div>
          )}

          {isFileField && (
            <div>
              <Label className="mb-1.5 block text-sm font-semibold text-slate-700">
                نوع الملف
              </Label>
              <Select
                value={field.fileType || "any"}
                onValueChange={(value) => updateField({ fileType: value })}
                dir="rtl"
              >
                <SelectTrigger className="h-11 rounded-xl border-slate-300 text-right focus:ring-[#4B2EE8]/20">
                  <SelectValue placeholder="اختر نوع الملف" />
                </SelectTrigger>
                <SelectContent align="start" dir="rtl">
                  <SelectItem value="any" className="text-right">أي ملف</SelectItem>
                  <SelectItem value="image" className="text-right">صور فقط</SelectItem>
                  <SelectItem value="document" className="text-right">مستندات فقط</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <span>
              <span className="block text-sm font-semibold text-slate-800">
                سؤال مطلوب
              </span>
              <span className="text-xs text-slate-500">
                لن يستطيع المستخدم الإرسال بدون إجابة.
              </span>
            </span>
            <Checkbox
              checked={field.required}
              onCheckedChange={(checked) => updateField({ required: checked === true })}
              className="border-[#4B2EE8] data-[state=checked]:bg-[#4B2EE8] data-[state=checked]:text-white"
            />
          </Label>
        </div>

        <DialogFooter className="gap-2 sm:flex-row-reverse sm:justify-start sm:space-x-0">
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={!canSave}
            className="bg-[#4B2EE8] hover:bg-[#462EA8]"
          >
            {mode === "edit" ? "حفظ التعديل" : "إضافة السؤال"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
