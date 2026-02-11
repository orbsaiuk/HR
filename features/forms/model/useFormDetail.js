'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formsApi } from '../api/formsApi';

export function useFormDetail(formId) {
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForm = async () => {
        if (!formId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await formsApi.getById(formId);
            setForm(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch form');
            console.error('Error fetching form:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteForm = async () => {
        try {
            await formsApi.delete(formId);
            router.push('/dashboard/forms');
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to delete form';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchForm();
    }, [formId]);

    return {
        form,
        loading,
        error,
        deleteForm,
        refetch: fetchForm,
    };
}
