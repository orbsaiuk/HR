import { Skeleton } from "@/components/ui/skeleton";

export default function ContractsLoading() {
  return (
    <section className="space-y-5 p-4 sm:p-6 lg:p-8" dir="rtl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-24" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
      </header>

      <div className="rounded-lg border border-[#E4E8F2] bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-10 max-w-md rounded-lg" />
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-lg border border-[#E4E8F2] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.03)]"
              dir="rtl"
            >
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/3" />
              <div className="mt-3 flex gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}