/**
 * Response status management hook
 */

import { useState } from 'react';
import { responseStatusService } from '../services/responseStatusService';

export function useResponseStatus(initialStatus = 'pending', initialNote = '') {
    const [status, setStatus] = useState(initialStatus);
    const [statusNote, setStatusNote] = useState(initialNote);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const updateStatus = async (responseId, newStatus, newNote, rejectionReason = '') => {
        try {
            setIsUpdating(true);
            setError(null);

            await responseStatusService.updateStatus(responseId, newStatus, newNote, rejectionReason);

            setStatus(newStatus);
            setStatusNote(newNote);

            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to update status';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusInfo = (statusValue) => {
        return responseStatusService.getStatusInfo(statusValue || status);
    };

    return {
        status,
        statusNote,
        setStatus,
        setStatusNote,
        isUpdating,
        error,
        updateStatus,
        getStatusInfo,
    };
}
