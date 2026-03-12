"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Skeleton placeholder for UserProfilePage.
 * Mirrors the layout of ProfileHeaderCard + ProfileSectionTabs.
 */
export function UserProfileSkeleton() {
  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Page title area */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* ProfileHeaderCard skeleton */}
      <Card className="overflow-hidden">
        {/* Gradient banner */}
        <Skeleton className="h-28 w-full rounded-none" />

        <CardContent className="relative pt-0 -mt-12 pb-6">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Skeleton className="h-20 w-20 rounded-full ring-4 ring-background shrink-0" />

              {/* Name / headline / meta */}
              <div className="flex-1 min-w-0 mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
                <Skeleton className="h-4 w-56" />
                <div className="flex flex-wrap gap-4 mt-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>

            {/* Edit button */}
            <Skeleton className="h-8 w-36 rounded-md shrink-0" />
          </div>

          {/* Bio lines */}
          <div className="border-t border-border my-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Social links */}
          <div className="border-t border-border my-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* ProfileSectionTabs skeleton */}
      <div className="space-y-4">
        {/* Tab bar */}
        <div className="flex gap-2 border-b border-border pb-1 overflow-x-auto">
          <Skeleton className="h-9 w-20 rounded-md shrink-0" />
          <Skeleton className="h-9 w-16 rounded-md shrink-0" />
          <Skeleton className="h-9 w-20 rounded-md shrink-0" />
          <Skeleton className="h-9 w-16 rounded-md shrink-0" />
          <Skeleton className="h-9 w-28 rounded-md shrink-0" />
        </div>

        {/* Tab content — work experience card stubs */}
        <div className="space-y-4 mt-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full shrink-0" />
                </div>
                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-5/6" />
                  <Skeleton className="h-3.5 w-4/5" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
