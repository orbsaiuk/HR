/**
 * Public form hook
 * Manages public form viewing and submission
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { publicFormsApi } from '../api/publicFormsApi';

export function usePublicForm(formId) {
    const router = useRouter();
    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!formId) return;
        fetchForm();
    }, [formId]);

    const fetchForm = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await publicFormsApi.getById(formId);

            if (data.status !== 'published') {
                setError('This form is not available');
            } else {
                setForm(data);
                // Check if user already submitted
                if (data.userHasSubmitted) {
                    setAlreadySubmitted(true);
                }
            }
        } catch (err) {
            setError(err.message || 'Failed to load form');
            console.error('Error fetching form:', err);
        } finally {
            setLoading(false);
        }
    };

    const submitForm = async (answers, files = {}) => {
        try {
            setSubmitting(true);
            await publicFormsApi.submit(formId, answers, files);
            setSubmitted(true);
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to submit form';
            return { success: false, error: errorMessage };
        } finally {
            setSubmitting(false);
        }
    };

    const goHome = () => {
        router.push('/');
    };

    return {
        form,
        loading,
        submitted,
        alreadySubmitted,
        error,
        submitting,
        submitForm,
        goHome,
        refetch: fetchForm,
    };
}
