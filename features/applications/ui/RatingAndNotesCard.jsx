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
        <CardTitle className="text-base">Recruiter Notes & Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs mb-2 block">Rating</Label>
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
          <Label className="text-xs mb-1 block">Notes</Label>
          <Textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            rows={4}
            placeholder="Add internal notes about this candidate..."
          />
        </div>

        {(status === "rejected" || rejectionReason) && (
          <div className="space-y-1">
            <Label className="text-xs">Rejection Reason</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => onRejectionReasonChange(e.target.value)}
              rows={2}
              placeholder="Reason for rejection (optional)..."
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
          <Save size={14} className="mr-1" />
          {isLoading ? "Saving..." : "Save Notes"}
        </Button>
      </CardContent>
    </Card>
  );
}
