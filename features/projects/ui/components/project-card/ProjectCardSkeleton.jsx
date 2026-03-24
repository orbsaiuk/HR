"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for ProjectCard component
 */
export function ProjectCardSkeleton({ viewMode = "list" }) {
  if (viewMode === "grid") {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Title + Client skeleton */}
        <div className="mb-2">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Status badge skeleton */}
        <Skeleton className="h-6 w-20 mb-2" />

        {/* Description skeleton */}
        <div className="space-y-2 mb-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-1.5 mb-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Metadata skeleton */}
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Footer skeleton */}
        <div className="flex justify-between items-center pt-4 border-t">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  // List view skeleton (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          {/* Title + Client skeleton */}
          <div className="mb-1">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Status badge skeleton */}
          <Skeleton className="h-6 w-20 mb-2" />

          {/* Description skeleton */}
          <div className="space-y-2 mb-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Tags skeleton */}
          <div className="flex gap-1.5 mb-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>

        {/* Bookmark skeleton */}
        <Skeleton className="h-6 w-6 shrink-0" />
      </div>

      {/* Footer skeleton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>
  );
}
