import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CalendarLoading() {
  return (
    <div className="p-6 md:p-8" dir="rtl">
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-52" />
          </div>
          <Skeleton className="h-10 w-36 rounded-xl" />
        </header>

        <Card className="rounded-xl border border-[#E6E8F0] bg-[#FCFCFE] shadow-[0_1px_2px_rgba(38,43,62,0.04)]">
          <CardContent className="p-3 md:p-4">
            <Skeleton className="mb-5 h-8 w-56" />

            <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              <Skeleton className="h-80 rounded-lg" />
              <div className="space-y-3 lg:col-span-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
