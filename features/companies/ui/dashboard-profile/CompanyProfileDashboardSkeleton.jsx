"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for the company profile dashboard page.
 * Mirrors the final layout: Header + 2-column (main + sidebar).
 */
export function CompanyProfileDashboardSkeleton() {
    return (
        <div dir="rtl" className="space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3 w-full">
                        <Skeleton className="h-8 w-56" />
                        <Skeleton className="h-4 w-40" />
                        <div className="flex flex-wrap gap-6 pt-2">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Body: Main + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Company Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-36" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Contact Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-28" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-10 rounded-lg" />
                            <Skeleton className="h-10 rounded-lg" />
                            <Skeleton className="h-10 rounded-lg" />
                            <Skeleton className="h-10 rounded-lg" />
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-24" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 space-y-3">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="border rounded-lg p-4 space-y-3">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>

                    {/* Positions Section */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-5 w-48" />
                                    <div className="flex gap-3">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </div>
                                <Skeleton className="h-4 w-12" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Office Locations */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl border p-6 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-8 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
