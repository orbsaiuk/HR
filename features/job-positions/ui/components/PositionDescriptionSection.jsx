"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";

export function PositionDescriptionSection({ description }) {
  if (!description) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Description</CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownContent
          content={description}
          className="text-muted-foreground"
        />
      </CardContent>
    </Card>
  );
}
