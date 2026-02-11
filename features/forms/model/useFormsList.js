'use client'

import { useState, useEffect } from 'react';
import { formsApi } from '../api/formsApi';

export function useFormsList() {
    const [forms, setForms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchForms = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await formsApi.getAll();
            setForms(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch forms');
            console.error('Error fetching forms:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchForms();
    }, []);

    return {
        forms,
        loading,
        error,
        refetch: fetchForms,
        setForms, // Expose for optimistic updates
    };
}
