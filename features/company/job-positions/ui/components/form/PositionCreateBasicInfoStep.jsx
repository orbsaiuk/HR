"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export function PositionCreateBasicInfoStep({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const picked = new Date(date);
    picked.setHours(0, 0, 0, 0);

    return picked < today;
  };

  const formatDeadlineForStorage = (date) => {
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T23:59`;
  };

  return (
    <Card className="border-slate-200">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-2xl font-bold text-slate-800">
          المعلومات الاساسية
        </CardTitle>
        <p className="text-sm text-slate-500">ادخل بيانات الوظيفة الرئيسية</p>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              عنوان الوظيفة <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="مثال: مطور React"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">
              القسم <span className="text-destructive">*</span>
            </Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="مثال: التطوير"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="type">نوع الوظيفة</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => onChange({ ...formData, type: val })}
              dir="rtl"
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="اختر نوع الوظيفة" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="full-time">دوام كامل</SelectItem>
                <SelectItem value="part-time">دوام جزئي</SelectItem>
                <SelectItem value="contract">عقد</SelectItem>
                <SelectItem value="internship">تدريب</SelectItem>
                <SelectItem value="remote">عن بعد</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="مثال: الرياض / عن بعد"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seniority">المستوى الوظيفي</Label>
            <Select
              value={formData.seniority}
              onValueChange={(val) => onChange({ ...formData, seniority: val })}
              dir="rtl"
            >
              <SelectTrigger id="seniority" className="w-full">
                <SelectValue placeholder="اختر المستوى الوظيفي" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="entry">مبتدئ</SelectItem>
                <SelectItem value="mid">متوسط الخبرة</SelectItem>
                <SelectItem value="senior">خبير</SelectItem>
                <SelectItem value="manager">مدير</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
          <div className="mb-3">
            <p className="font-semibold text-slate-800">نطاق الراتب</p>
            <p className="text-xs text-slate-500">
              يمكنك ترك هذا الحقل فارغا اذا لم يتم تحديد الراتب لهذا الدور.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">من</Label>
              <Input
                id="salaryMin"
                type="number"
                min="0"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="5000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryMax">الى</Label>
              <Input
                id="salaryMax"
                type="number"
                min="0"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="22000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">العملة</Label>
              <Input
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="USD / SAR"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="deadline">اخر موعد للتقديم</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-between text-right font-normal",
                    !formData.deadline && "text-muted-foreground",
                  )}
                  dir="rtl"
                >
                  {formData.deadline
                    ? format(new Date(formData.deadline), "PPP", { locale: ar })
                    : "اختر تاريخا"}
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start" dir="rtl">
                <Calendar
                  mode="single"
                  selected={
                    formData.deadline ? new Date(formData.deadline) : undefined
                  }
                  disabled={(date) => isPastDate(date)}
                  onSelect={(date) => {
                    if (!date || isPastDate(date)) {
                      return;
                    }

                    onChange({
                      ...formData,
                      deadline: formatDeadlineForStorage(date),
                    });
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-md border border-rose-100 bg-rose-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-rose-600">وظيفة عاجلة</p>
                <p className="text-xs text-rose-500">
                  ستظهر بشكل مميز في نتائج البحث
                </p>
              </div>
              <Checkbox
                id="isUrgent"
                checked={Boolean(formData.isUrgent)}
                onCheckedChange={(checked) =>
                  onChange({ ...formData, isUrgent: checked === true })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
