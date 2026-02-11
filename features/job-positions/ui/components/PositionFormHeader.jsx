"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PositionFormHeader({ title, backHref }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link href={backHref}>
          <ArrowLeft size={20} />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-muted-foreground">
          {title.includes("Create")
            ? "Fill in the details for the new position."
            : "Update the details for this position."}
        </p>
      </div>
    </div>
  );
}
