/**
 * Dashboard page component (orchestration only)
 * Delegates to smaller components for rendering
 */

"use client";

import { useDashboardStats } from "../../model/useDashboardStats";
import {
  DashboardApplicantsSummary,
  DashboardJobsChart,
  DashboardLatestJobs,
  DashboardStatCards,
} from "../components";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Error } from "@/shared/components/feedback/Error";

export function DashboardPage() {
  const { stats, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 rounded-2xl w-full" />
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="rounded-2xl">
              <CardContent className="flex items-center gap-4 p-5">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="rounded-2xl"><CardContent className="p-5 space-y-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-32 w-full" /></CardContent></Card>
          <Card className="xl:col-span-2 rounded-2xl"><CardContent className="p-5 space-y-4"><Skeleton className="h-5 w-32" /><Skeleton className="h-44 w-full" /></CardContent></Card>
        </section>
      </div>
    );
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6 shadow-sm">
        <p className="text-sm text-slate-500">{stats.header.companyName}</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {stats.header.greeting}
        </h1>
        <p className="mt-2 text-slate-600">{stats.header.subtitle}</p>
      </div>

      <DashboardStatCards metrics={stats.metrics} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <DashboardApplicantsSummary summary={stats.applicantsSummary} />
        </div>
        <div className="xl:col-span-2">
          <DashboardJobsChart overview={stats.jobsOverview} />
        </div>
      </div>

      <DashboardLatestJobs jobs={stats.latestJobs} />
    </div>
  );
}
