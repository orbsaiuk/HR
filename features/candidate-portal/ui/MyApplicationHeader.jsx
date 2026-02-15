"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  StatusBadge,
  StatusTimeline,
} from "@/features/careers/ui/components/StatusTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function MyApplicationHeader({ positionTitle, status, application }) {
  return (
    <>
      <Button
        variant="link"
        asChild
        className="px-0 mb-6 text-muted-foreground hover:text-foreground"
      >
        <Link href="/my-applications">
          <ArrowLeft size={16} />
          Back to My Applications
        </Link>
      </Button>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-foreground">
                  {positionTitle || "Untitled Position"}
                </h1>
                <StatusBadge status={status} />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {application.position?.department && (
                  <span className="flex items-center gap-1.5">
                    {application.position.department}
                  </span>
                )}
                {application.position?.location && (
                  <span className="flex items-center gap-1.5">
                    {application.position.location}
                  </span>
                )}
                {application.position?.type && (
                  <span className="flex items-center gap-1.5">
                    {application.position.type}
                  </span>
                )}
                {application.appliedAt && (
                  <span className="flex items-center gap-1.5">
                    Applied{" "}
                    {new Date(application.appliedAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          <StatusTimeline currentStatus={status} />
        </CardContent>
      </Card>
    </>
  );
}
