/**
 * Status card component for response detail page
 */

'use client';

import { CheckSquare } from 'lucide-react';

export function StatusCard({
    status,
    onStatusChange,
    onUpdate,
    isUpdating,
    hasChanges,
}) {

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <CheckSquare size={24} className="text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Status</h2>
            </div>
            <div className="space-y-3">
                <select
                    value={status}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
                {hasChanges && (
                    <button
                        onClick={onUpdate}
                        disabled={isUpdating}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </button>
                )}
            </div>
        </div>
    );
}
