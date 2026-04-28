import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div
      dir="rtl"
      className="space-y-8 rounded-3xl bg-[#F8F9FB] p-6 lg:p-10 min-h-screen"
    >
      <section className="space-y-1.5 text-right">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-56" />
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </section>

      <Card className="overflow-hidden rounded-2xl border-0 shadow-sm ring-1 ring-slate-100">
        <CardHeader className="flex-row items-center justify-between border-b border-slate-100/80 px-6 py-5">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </CardHeader>
        <CardContent className="p-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-slate-100/80 px-6 py-4"
            >
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
