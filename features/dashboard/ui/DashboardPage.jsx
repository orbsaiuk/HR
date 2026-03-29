/**
 * Dashboard page component (orchestration only)
 * Delegates to smaller components for rendering
 */

'use client';

import { useDashboardStats } from '../model/useDashboardStats';
import { DashboardStatCards } from './DashboardStatCards';
import { DashboardApplicantsSummary } from './DashboardApplicantsSummary';
import { DashboardJobsChart } from './DashboardJobsChart';
import { DashboardLatestJobs } from './DashboardLatestJobs';
import { Loading } from '@/shared/components/feedback/Loading';
import { Error } from '@/shared/components/feedback/Error';

export function DashboardPage() {
    const { stats, loading, error, refetch } = useDashboardStats();

    if (loading) {
        return <Loading fullPage />;
    }

    if (error) {
        return <Error message={error} onRetry={refetch} />;
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    {stats.header.companyName}
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    {stats.header.greeting}
                </h1>
                <p className="mt-2 text-slate-600">
                    {stats.header.subtitle}
                </p>
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
