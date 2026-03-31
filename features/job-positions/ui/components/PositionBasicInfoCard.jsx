"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PositionBasicInfoCard({ formData, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>المعلومات الأساسية</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">
            المسمى الوظيفي <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="مثال: مهندس برمجيات أول"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">القسم</Label>
            <Input
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="مثال: الهندسة"
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">نوع التوظيف</Label>
            <Select
              value={formData.type}
              onValueChange={(val) => onChange({ ...formData, type: val })}
              dir="rtl"
            >
              <SelectTrigger id="type" className="w-full">
                <SelectValue placeholder="اختر نوع التوظيف" />
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">الوصف</Label>
          <RichTextEditor
            id="description"
            name="description"
            value={formData.description}
            onChange={(val) => onChange({ ...formData, description: val })}
            rows={6}
            placeholder="صف الدور، المسؤوليات، وما يجعله مثيراً للاهتمام..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requirements">المتطلبات</Label>
          <RichTextEditor
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={(val) => onChange({ ...formData, requirements: val })}
            rows={6}
            placeholder="أدرج المؤهلات، المهارات، والخبرات الأساسية المطلوبة..."
          />
        </div>
      </CardContent>
    </Card>
  );
}
