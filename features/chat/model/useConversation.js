'use client'

import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';

export function useConversation(conversationId) {
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchConversation = async () => {
        if (!conversationId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await chatApi.getConversation(conversationId);
            setConversation(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch conversation');
            console.error('Error fetching conversation:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [conversationId]);

    return {
        conversation,
        loading,
        error,
        refetch: fetchConversation,
    };
}
