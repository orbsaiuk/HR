"use client";

import Link from "next/link";
import { Briefcase, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PositionInfoCard({ position }) {
  if (!position) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Position</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium">{position.title || "—"}</p>
        {position.department && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Briefcase size={14} />
            {position.department}
          </div>
        )}
        {position.location && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin size={14} />
            {position.location}
          </div>
        )}
        {position.type && (
          <Badge variant="outline" className="capitalize">
            {position.type}
          </Badge>
        )}
        {position && (
          <Button variant="outline" size="sm" className="w-full mt-2" asChild>
            <Link href={`/dashboard/positions/${position._id}`}>
              View Position
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
