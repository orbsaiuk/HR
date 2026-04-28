import { Skeleton } from "@/components/ui/skeleton";

export default function FormsLoading() {
  return (
    <div className="space-y-6" dir="rtl">
      <Skeleton className="h-20 rounded-2xl w-full" />

      <div className="rounded-xl border bg-white p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-lg border border-[#E4E8F2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
              dir="rtl"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-end gap-2 pt-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}