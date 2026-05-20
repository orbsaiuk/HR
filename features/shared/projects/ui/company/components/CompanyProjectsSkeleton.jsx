import { Skeleton } from "@/components/ui/skeleton";

export function CompanyProjectsSkeleton() {
  return (
    <section className="p-4 sm:p-6 lg:p-8" dir="rtl">
      {/* Header and Add Button Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full sm:w-32" />
      </div>

      <div className="mt-6 space-y-4">
        {/* Filters Skeleton */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center border-b border-gray-100 pb-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Project Cards Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="rounded-sm border border-[#E6EAF2] bg-white px-3 py-3 sm:px-5 sm:py-4"
              dir="rtl"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-1/3 min-w-[200px]" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  
                  <Skeleton className="h-4 w-32" />
                  
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 sm:shrink-0">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
