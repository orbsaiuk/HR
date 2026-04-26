"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

export function PositionCreateDetailsStep({ formData, onChange }) {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>تفاصيل الوظيفة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <Label htmlFor="description">وصف الوظيفة</Label>
          <RichTextEditor
            id="description"
            name="description"
            value={formData.description}
            onChange={(val) => onChange({ ...formData, description: val })}
            rows={8}
            placeholder="صف الدور، المسؤوليات، وسياق هذه الفرصة..."
          />

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <Label htmlFor="requirements">المتطلبات والمهارات</Label>
            <RichTextEditor
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={(val) => onChange({ ...formData, requirements: val })}
              rows={8}
              placeholder="اذكر المؤهلات، المهارات، وسنوات الخبرة المطلوبة لهذه الوظيفة..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
