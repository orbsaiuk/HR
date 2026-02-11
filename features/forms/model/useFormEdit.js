'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formsApi } from '../api/formsApi';

export function useFormEdit(formId) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savingDraft, setSavingDraft] = useState(false);
    const [savingPublish, setSavingPublish] = useState(false);
    const [error, setError] = useState(null);

    const fetchForm = async () => {
        if (!formId) return;

        try {
            setLoading(true);
            const data = await formsApi.getById(formId);
            setTitle(data.title);
            setDescription(data.description || '');
            setFields(data.fields || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch form');
        } finally {
            setLoading(false);
        }
    };

    const saveForm = async (publish = false) => {
        if (!title.trim()) {
            setError('Please enter a form title');
            return { success: false, error: 'Please enter a form title' };
        }

        if (publish) {
            setSavingPublish(true);
        } else {
            setSavingDraft(true);
        }
        setError(null);

        try {
            const formData = {
                title,
                description,
                fields,
                status: publish ? 'published' : 'draft',
            };

            await formsApi.update(formId, formData);
            router.push(`/dashboard/forms/${formId}`);
            return { success: true };
        } catch (err) {
            const errorMessage = err.message || 'Failed to save form';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setSavingDraft(false);
            setSavingPublish(false);
        }
    };

    useEffect(() => {
        fetchForm();
    }, [formId]);

    return {
        title,
        setTitle,
        description,
        setDescription,
        fields,
        setFields,
        loading,
        savingDraft,
        savingPublish,
        error,
        saveForm,
    };
}
