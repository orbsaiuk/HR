"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function PositionFormHeader({ title, subTitle, backHref }) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" asChild>
        <Link href={backHref}>
          <ArrowRight size={20} />
        </Link>
      </Button>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-muted-foreground">{subTitle}</p>
      </div>
    </div>
  );
}
