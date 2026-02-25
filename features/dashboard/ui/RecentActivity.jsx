/**
 * Recent activity list component
 */

import Link from 'next/link';
import { Clock, CheckCircle, FileText, Plus } from 'lucide-react';
import { formatRelativeDate } from '../lib/dateUtils';
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function RecentActivity({ activities }) {
    if (activities.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-12 text-center">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No forms yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Create your first form to get started
                    </p>
                    <PermissionGate permission={PERMISSIONS.MANAGE_FORMS}>
                        <Link
                            href="/dashboard/forms/create"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            Create Form
                        </Link>
                    </PermissionGate>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            <div className="divide-y divide-gray-200">
                {activities.map((activity) => (
                    <Link
                        key={activity.id}
                        href={`/dashboard/forms/${activity.id}`}
                        className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.status === 'published'
                                    ? 'bg-green-100'
                                    : 'bg-yellow-100'
                                    }`}
                            >
                                {activity.status === 'published' ? (
                                    <CheckCircle className="text-green-600" size={20} />
                                ) : (
                                    <FileText className="text-yellow-600" size={20} />
                                )}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-600">
                                    {activity.status === 'published'
                                        ? 'Form published'
                                        : 'Form created or updated'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock size={16} />
                            <span>{formatRelativeDate(activity.date)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

