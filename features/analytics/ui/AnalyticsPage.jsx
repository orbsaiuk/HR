/**
 * Analytics page component
 */

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, MessageSquare, Clock, BarChart3 } from 'lucide-react';
import { useAnalytics } from '../model/useAnalytics';
import { Loading } from '@/shared/components/feedback/Loading';
import { Error } from '@/shared/components/feedback/Error';

export function AnalyticsPage({ formId }) {
    const router = useRouter();
    const { form, analytics, loading, error, refetch } = useAnalytics(formId);

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-600 mt-1">{form?.title || 'Form'}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MessageSquare className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Responses</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.totalResponses || 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-green-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Completion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.completionRate || 0}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Clock className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Avg. Time</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {analytics?.avgTime || '0m'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Fields</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {form?.fields?.length || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Field Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Field Statistics</h2>
                {analytics?.fieldStats && analytics.fieldStats.length > 0 ? (
                    <div className="space-y-4">
                        {analytics.fieldStats.map((stat) => (
                            <div key={stat.fieldId} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-gray-900">{stat.label}</p>
                                    <p className="text-sm text-gray-500">{stat.type}</p>
                                </div>
                                <div className="space-y-2">
                                    {stat.options?.map((option) => (
                                        <div key={option.value} className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${option.percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-600 w-20 text-right">
                                                {option.count} ({option.percentage}%)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No field statistics available</p>
                )}
            </div>
        </div>
    );
}
