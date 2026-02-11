/**
 * Response detail hook
 * Manages single response state and actions
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { responsesApi } from '../api/responsesApi';
import { formsApi } from '@/features/forms/api/formsApi';

export function useResponseDetail(responseId, formId) {
    const router = useRouter();
    const [response, setResponse] = useState(null);
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!responseId || !formId) return;

        try {
            setLoading(true);
            setError(null);
            const [responseData, formData] = await Promise.all([
                responsesApi.getById(responseId),
                formsApi.getById(formId),
            ]);
            setResponse(responseData);
            setForm(formData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteResponse = async () => {
        try {
            await responsesApi.delete(responseId);
            router.push(`/dashboard/forms/${formId}/responses`);
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete response';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchData();
    }, [responseId, formId]);

    return {
        response,
        form,
        loading,
        error,
        deleteResponse,
        refetch: fetchData,
    };
}
