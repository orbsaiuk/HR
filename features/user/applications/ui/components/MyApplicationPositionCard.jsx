"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/ui/markdown-content";

export function MyApplicationPositionCard({ position }) {
  if (!position?.description) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wide">
          About the Role
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MarkdownContent
          content={position.description}
          className="text-sm text-muted-foreground line-clamp-6"
        />
        <Button variant="link" asChild className="px-0 mt-2 h-auto">
          <Link href={`/careers/${position._id}`}>View full position →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
