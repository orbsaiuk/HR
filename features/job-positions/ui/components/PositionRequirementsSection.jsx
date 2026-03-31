"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";

export function PositionRequirementsSection({ requirements }) {
  if (!requirements) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>المتطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownContent
          content={requirements}
          className="text-muted-foreground"
        />
      </CardContent>
    </Card>
  );
}
