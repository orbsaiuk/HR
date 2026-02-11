/**
 * Responses list hook
 */

import { useState, useEffect } from 'react';
import { responsesApi } from '../api/responsesApi';
import { formsApi } from '@/features/forms/api/formsApi';

export function useResponses(formId) {
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!formId) return;

        try {
            setLoading(true);
            setError(null);
            const [formData, responsesData] = await Promise.all([
                formsApi.getById(formId),
                responsesApi.getByFormId(formId),
            ]);
            setForm(formData);
            setResponses(responsesData);
        } catch (err) {
            setError(err.message || 'Failed to fetch data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formId]);

    return {
        form,
        responses,
        loading,
        error,
        refetch: fetchData,
    };
}
