'use client';

import { User, Calendar, CheckSquare } from 'lucide-react';

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getStatusDisplay = (status) => {
    const statusMap = {
        pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
        reviewed: { label: 'Reviewed', color: 'text-blue-600 bg-blue-50 border-blue-200' },
        approved: { label: 'Approved', color: 'text-green-600 bg-green-50 border-green-200' },
        rejected: { label: 'Rejected', color: 'text-red-600 bg-red-50 border-red-200' },
    };
    return statusMap[status] || statusMap.pending;
};

function InfoCard({ icon: Icon, iconColor, title, children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <Icon size={24} className={iconColor} />
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            </div>
            {children}
        </div>
    );
}

export function ResponseInfoCards({ response }) {
    const statusDisplay = getStatusDisplay(response?.status || 'pending');

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Respondent Card */}
            <InfoCard icon={User} iconColor="text-blue-600" title="Respondent">
                <div className="space-y-2">
                    <p className="text-gray-600">
                        <span className="font-medium">Name:</span>{' '}
                        {response.user?.name || 'Anonymous'}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Email:</span>{' '}
                        {response.user?.email || 'N/A'}
                    </p>
                </div>
            </InfoCard>

            {/* Submission Info Card */}
            <InfoCard icon={Calendar} iconColor="text-purple-600" title="Submission Info">
                <div className="space-y-2">
                    <p className="text-gray-600">
                        <span className="font-medium">Submitted:</span>{' '}
                        {formatDate(response.submittedAt)}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">Updated:</span>{' '}
                        {formatDate(response.updatedAt)}
                    </p>
                </div>
            </InfoCard>

            {/* Status Card */}
            <InfoCard icon={CheckSquare} iconColor="text-green-600" title="Status">
                <div className="flex items-center justify-center h-16">
                    <span className={`px-4 py-2 rounded-lg border font-semibold ${statusDisplay.color}`}>
                        {statusDisplay.label}
                    </span>
                </div>
            </InfoCard>
        </div>
    );
}
