"use client";

import { Star, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RatingAndNotesCard({
  rating,
  onRatingChange,
  notes,
  onNotesChange,
  rejectionReason,
  onRejectionReasonChange,
  status,
  onSave,
  isLoading,
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">ملاحظات المقيم والتقييم</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs mb-2 block">التقييم</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star === rating ? 0 : star)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs mb-1 block">ملاحظات</Label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            placeholder="أضف ملاحظات داخلية عن هذا المتقدم..."
          />
        </div>

        {(status === "rejected" || rejectionReason) && (
          <div className="space-y-1">
            <Label className="text-xs">سبب الرفض</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              rows={2}
              placeholder="سبب الرفض (اختياري)..."
            />
          </div>
        )}

        <Button
          type="button"
          size="sm"
          className="w-full"
          disabled={isLoading}
          onClick={onSave}
        >
          <Save size={14} className="ml-1" />
          {isLoading ? "جاري الحفظ..." : "حفظ الملاحظات"}
        </Button>
      </CardContent>
    </Card>
  );
}
