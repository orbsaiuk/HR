/**
 * Response status service
 * Handles status-related business logic
 */

import { apiClient } from '@/shared/api/client';

export const responseStatusService = {
    /**
     * Update response status via API
     */
    async updateStatus(responseId, status, statusNote = '', rejectionReason = '') {
        const response = await fetch(`/api/responses/${responseId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status,
                statusNote,
                rejectionReason,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        return response.json();
    },

    /**
     * Get status display information
     */
    getStatusInfo(status) {
        const statusMap = {
            pending: {
                color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                icon: '⏳',
                label: 'Pending'
            },
            reviewed: {
                color: 'bg-blue-100 text-blue-800 border-blue-200',
                icon: '👁️',
                label: 'Reviewed'
            },
            approved: {
                color: 'bg-green-100 text-green-800 border-green-200',
                icon: '✅',
                label: 'Approved'
            },
            rejected: {
                color: 'bg-red-100 text-red-800 border-red-200',
                icon: '❌',
                label: 'Rejected'
            }
        };

        return statusMap[status] || statusMap.pending;
    }
};
