"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, FileText, ChevronDown, ChevronUp, Trash2, CalendarIcon } from "lucide-react";
import { formsApi } from "@/features/forms/api/formsApi";
import { FormBuilder } from "@/features/forms/components/FormBuilder/FormBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function ApplicationFormSection({
  formId,
  onFormIdChange,
  newForm,
  onNewFormChange,
  mode,
  onModeChange,
  deadline,
  onDeadlineChange,
}) {
  const [forms, setForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    async function loadForms() {
      try {
        const data = await formsApi.getAll();
        setForms(data);
      } catch (err) {
        console.error("Failed to load forms:", err);
      } finally {
        setLoadingForms(false);
      }
    }
    loadForms();
  }, []);

  const handleModeSwitch = (newMode) => {
    onModeChange(newMode);
    if (newMode === "create") {
      onFormIdChange("");
    } else {
      onNewFormChange({ title: "", description: "", fields: [] });
    }
  };

  const handleRemoveForm = () => {
    onFormIdChange("");
    onNewFormChange({ title: "", description: "", fields: [] });
    onModeChange("select");
  };

  const selectedForm = forms.find((f) => f._id === formId);

  return (
    <Card>
      <CardHeader
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            نموذج التقديم
          </CardTitle>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          {/* Mode toggle */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={mode === "select" ? "default" : "outline"}
              onClick={() => handleModeSwitch("select")}
            >
              استخدام نموذج موجود
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "create" ? "default" : "outline"}
              onClick={() => handleModeSwitch("create")}
            >
              <Plus size={16} className="mr-1" />
              إنشاء نموذج جديد
            </Button>
            {(formId || newForm.fields.length > 0) && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-destructive mr-auto"
                onClick={handleRemoveForm}
              >
                <Trash2 size={16} className="ml-1" />
                إزالة النموذج
              </Button>
            )}
          </div>

          {/* Existing form selector */}
          {mode === "select" && (
            <div className="space-y-2">
              <Label htmlFor="formId">اختر نموذجاً</Label>
              <Select
                value={formId || undefined}
                onValueChange={(val) =>
                  onFormIdChange(val === "none" ? "" : val)
                }
                dir="rtl"
              >
                <SelectTrigger id="formId" className="w-full">
                  <SelectValue placeholder="لا يوجد نموذج مرتبط" />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  {loadingForms && (
                    <SelectItem value="loading" disabled>
                      جاري التحميل...
                    </SelectItem>
                  )}
                  <SelectItem value="none">لا يوجد نموذج مرتبط</SelectItem>
                  {forms.map((form) => (
                    <SelectItem key={form._id} value={form._id}>
                      {form.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedForm && (
                <p className="text-xs text-muted-foreground">
                  &quot;{selectedForm.title}&quot; —{" "}
                  {selectedForm.fields?.length || 0} حقل/حقول
                </p>
              )}
            </div>
          )}

          {/* Inline form builder */}
          {mode === "create" && (
            <div className="space-y-4 rounded-lg border border-dashed border-gray-300 p-4 bg-gray-50/50">
              <p className="text-sm text-muted-foreground">
                قم ببناء النموذج الذي سيملأه المتقدمون عند التقديم لهذا المنصب.
              </p>
              <FormBuilder
                title={newForm.title}
                description={newForm.description}
                fields={newForm.fields}
                onTitleChange={(title) =>
                  onNewFormChange({ ...newForm, title })
                }
                onDescriptionChange={(description) =>
                  onNewFormChange({ ...newForm, description })
                }
                onFieldsChange={(fields) =>
                  onNewFormChange({ ...newForm, fields })
                }
              />
            </div>
          )}

          {/* Deadline */}
          <div className="space-y-2 pt-2 border-t flex flex-col items-start w-full">
            <Label className="mb-1 block">الموعد النهائي للتقديم</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                  dir="rtl"
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {deadline ? (
                    format(new Date(deadline), "PPP - p", { locale: ar })
                  ) : (
                    <span>اختر تاريخاً ووقتاً</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                <Calendar
                  mode="single"
                  selected={deadline ? new Date(deadline) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const current = deadline ? new Date(deadline) : new Date();
                      date.setHours(current.getHours());
                      date.setMinutes(current.getMinutes());
                      
                      const pad = (n) => (n < 10 ? "0" + n : n);
                      const formatted = 
                        date.getFullYear() + "-" + 
                        pad(date.getMonth() + 1) + "-" + 
                        pad(date.getDate()) + "T" + 
                        pad(date.getHours()) + ":" + 
                        pad(date.getMinutes());
                      onDeadlineChange(formatted);
                    }
                  }}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Label className="mb-2 block text-sm">الوقت:</Label>
                  <Input 
                    type="time"
                    className="w-full text-left block"
                    dir="ltr"
                    value={deadline && deadline.includes("T") ? deadline.split("T")[1].substring(0, 5) : ""}
                    onChange={(e) => {
                      const time = e.target.value;
                      if (!time) return;
                      
                      let dateStr = "";
                      if (deadline && deadline.includes("T")) {
                        dateStr = deadline.split("T")[0];
                      } else {
                        const d = new Date();
                        const pad = (n) => (n < 10 ? "0" + n : n);
                        dateStr = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
                      }
                      onDeadlineChange(`${dateStr}T${time}`);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
