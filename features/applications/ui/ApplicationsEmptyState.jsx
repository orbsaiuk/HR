"use client";

import { Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function ApplicationsEmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 rounded-full bg-gray-100 mb-4">
          <Inbox size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          No applications yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Candidates will appear here when they apply to this position. Share
          the job listing to start receiving applications.
        </p>
      </CardContent>
    </Card>
  );
}
