"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function CareerDetailSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <Skeleton className="h-4 w-32 mb-4" />
                    <Skeleton className="h-8 w-80 mb-3" />
                    <div className="flex flex-wrap items-center gap-4">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>
            </div>

            {/* Content Grid Skeleton */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-28" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardContent>
                        </Card>

                        {/* Requirements Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-24" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-4/5" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="space-y-4">
                        {/* Buttons */}
                        <Skeleton className="h-11 w-full rounded-md" />
                        <Skeleton className="h-11 w-full rounded-md" />

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-5 w-28" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
