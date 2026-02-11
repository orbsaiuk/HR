"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PositionFormActions({ isLoading, submitText, cancelHref }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button variant="outline" asChild>
        <Link href={cancelHref}>Cancel</Link>
      </Button>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? `${submitText.replace(/[!]/, "")}...` : submitText}
      </Button>
    </div>
  );
}
