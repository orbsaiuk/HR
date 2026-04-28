import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div dir="rtl" className="min-h-screen p-3 sm:p-4 lg:p-6">
      <Skeleton className="mb-4 h-8 w-32 sm:mb-6" />
      <Card className="mb-4 rounded-2xl border-slate-200 shadow-none sm:mb-6">
        <CardContent className="p-4">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
      <div
        className="grid gap-4 sm:gap-6 lg:grid-cols-[19rem_minmax(0,1fr)]"
        style={{ direction: "ltr" }}
      >
        <aside dir="rtl" className="order-2 space-y-4 sm:space-y-6 lg:order-1">
          <Card className="rounded-2xl border-slate-200 shadow-none">
            <CardContent className="p-4">
              <Skeleton className="h-56 w-full" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-none">
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </aside>
        <section dir="rtl" className="order-1 space-y-4 sm:space-y-6 lg:order-2">
          <Card className="rounded-2xl border-slate-200 shadow-none">
            <CardContent className="p-4">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-none">
            <CardContent className="p-4">
              <Skeleton className="h-36 w-full" />
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-none">
            <CardContent className="p-4">
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
