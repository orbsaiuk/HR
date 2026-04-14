"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function CompanyProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <Skeleton className="h-4 w-32 mb-6" />
                    <div className="flex items-start gap-6">
                        <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-8 w-64" />
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-5 w-20 rounded-md" />
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-6">
                    {/* About Card */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>

                    {/* Positions Section */}
                    <div>
                        {/* Header Controls */}
                        <div className="flex items-center justify-between gap-2 mb-4">
                            <Skeleton className="h-6 w-40" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-8 w-28" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>

                        {/* Position Cards Grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <CardContent className="pt-4 space-y-3">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <div className="flex flex-wrap gap-2">
                                            <Skeleton className="h-4 w-16 rounded-md" />
                                            <Skeleton className="h-4 w-20" />
                                        </div>
                                        <Skeleton className="h-3 w-24" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
