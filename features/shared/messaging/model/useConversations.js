'use client'

import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';

export function useConversations() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await chatApi.getConversations();
            setConversations(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch conversations');
            console.error('Error fetching conversations:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    return {
        conversations,
        loading,
        error,
        refetch: fetchConversations,
    };
}
