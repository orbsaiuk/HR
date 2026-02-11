'use client';

import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';

export function useUnreadCount(enabled = true) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchUnreadCount = async () => {
        if (!enabled) {
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const conversations = await chatApi.getConversations();

            // Sum up all unread counts from conversations
            const total = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
            setUnreadCount(total);
        } catch (err) {
            console.error('Error fetching unread count:', err);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!enabled) {
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        fetchUnreadCount();

        // Poll for updates every 10 seconds
        const interval = setInterval(fetchUnreadCount, 10000);

        // Listen for messages read events
        const handleMessagesRead = () => {
            fetchUnreadCount();
        };

        window.addEventListener('messagesRead', handleMessagesRead);

        return () => {
            clearInterval(interval);
            window.removeEventListener('messagesRead', handleMessagesRead);
        };
    }, [enabled]);

    return {
        unreadCount,
        loading,
        refetch: fetchUnreadCount,
    };
}
