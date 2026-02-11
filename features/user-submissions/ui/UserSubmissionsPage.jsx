/**
 * User submissions page
 */

'use client';

import { FileText, Clock, Filter } from 'lucide-react';
import { useState } from 'react';
import { useUserSubmissions } from '../model/useUserSubmissions';
import { StatusBadge } from '@/features/responses/components/StatusBadge';
import { Loading } from '@/shared/components/feedback/Loading';
import { Error } from '@/shared/components/feedback/Error';

export function UserSubmissionsPage() {
    const { submissions, loading, error, refetch } = useUserSubmissions();
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredSubmissions = submissions.filter(submission => {
        if (statusFilter === 'all') return true;
        return submission.status === statusFilter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
                <p className="text-gray-600 mt-1">
                    Track the status of your form submissions
                </p>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <Filter size={20} className="text-gray-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Submissions List */}
            {filteredSubmissions.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No submissions found
                    </h3>
                    <p className="text-gray-500">
                        {statusFilter === 'all'
                            ? "You haven't submitted any forms yet"
                            : `No submissions with status: ${statusFilter}`}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredSubmissions.map((submission) => (
                        <div
                            key={submission._id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {submission.form?.title || 'Untitled Form'}
                                        </h3>
                                        <StatusBadge status={submission.status} />
                                        {submission.statusUpdated && !submission.statusViewed && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                New Update
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            Submitted: {formatDate(submission.submittedAt)}
                                        </span>
                                        {submission.updatedAt !== submission.submittedAt && (
                                            <span className="flex items-center gap-1">
                                                Updated: {formatDate(submission.updatedAt)}
                                            </span>
                                        )}
                                    </div>
                                    {submission.status === 'rejected' && submission.rejectionReason && (
                                        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <p className="text-sm text-red-800">
                                                <span className="font-medium">Rejection Reason:</span> {submission.rejectionReason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
