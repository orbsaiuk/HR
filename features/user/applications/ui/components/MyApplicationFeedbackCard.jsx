"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function MyApplicationFeedbackCard({ status, rejectionReason }) {
  if (status !== "rejected" || !rejectionReason) return null;

  return (
    <Card className="border-destructive bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-sm text-destructive">Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-destructive/90">{rejectionReason}</p>
      </CardContent>
    </Card>
  );
}
