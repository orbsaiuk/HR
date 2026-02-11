/**
 * Status badge component for displaying response status
 */

'use client';

import { responseStatusService } from '../services/responseStatusService';

export function StatusBadge({ status }) {
    const statusInfo = responseStatusService.getStatusInfo(status || 'pending');

    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            <span>{statusInfo.icon}</span>
            {statusInfo.label}
        </span>
    );
}
