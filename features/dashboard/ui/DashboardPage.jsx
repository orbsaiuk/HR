/**
 * Dashboard page component (orchestration only)
 * Delegates to smaller components for rendering
 */

'use client';

import { useDashboardStats } from '../model/useDashboardStats';
import { StatsCards } from './StatsCards';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';
import { GettingStarted } from './GettingStarted';
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
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Welcome back! Here's an overview of your forms and activity.
                </p>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity activities={stats.recentActivity} />

            {/* Getting Started (shown when no forms) */}
            {stats.totalForms === 0 && <GettingStarted />}
        </div>
    );
}
