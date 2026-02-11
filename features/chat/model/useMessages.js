'use client'

import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';

export function useMessages(conversationId) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);

    const fetchMessages = async () => {
        if (!conversationId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await chatApi.getMessages(conversationId);
            setMessages(data);

            // Mark messages as read after fetching
            await chatApi.markAsRead(conversationId).catch(err => {
                console.error('Error marking messages as read:', err);
                // Don't throw error, just log it
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch messages');
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content, currentUser) => {
        if (!content.trim()) return { success: false, error: 'Message cannot be empty' };

        // Create optimistic message
        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            conversationId,
            sender: currentUser,
            content: content.trim(),
            createdAt: new Date().toISOString(),
            read: false,
            isPending: true,
        };

        // Add optimistic message immediately
        setMessages(prev => [...prev, optimisticMessage]);
        setSending(true);

        try {
            const newMessage = await chatApi.sendMessage(conversationId, content);

            // Replace optimistic message with real one
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === optimisticMessage._id ? newMessage : msg
                )
            );

            return { success: true, message: newMessage };
        } catch (err) {
            const errorMessage = err.message || 'Failed to send message';

            // Mark message as failed
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === optimisticMessage._id
                        ? { ...msg, isPending: false, isFailed: true }
                        : msg
                )
            );

            return { success: false, error: errorMessage, messageId: optimisticMessage._id };
        } finally {
            setSending(false);
        }
    };

    const retryMessage = async (messageId, currentUser) => {
        const failedMessage = messages.find(msg => msg._id === messageId);
        if (!failedMessage) return { success: false, error: 'Message not found' };

        // Mark as pending again
        setMessages(prev =>
            prev.map(msg =>
                msg._id === messageId
                    ? { ...msg, isPending: true, isFailed: false }
                    : msg
            )
        );

        setSending(true);

        try {
            const newMessage = await chatApi.sendMessage(conversationId, failedMessage.content);

            // Replace failed message with real one
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId ? newMessage : msg
                )
            );

            return { success: true, message: newMessage };
        } catch (err) {
            const errorMessage = err.message || 'Failed to send message';

            // Mark as failed again
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, isPending: false, isFailed: true }
                        : msg
                )
            );

            return { success: false, error: errorMessage };
        } finally {
            setSending(false);
        }
    };

    const deleteMessage = (messageId) => {
        setMessages(prev => prev.filter(msg => msg._id !== messageId));
    };

    useEffect(() => {
        fetchMessages();
    }, [conversationId]);

    return {
        messages,
        loading,
        error,
        sending,
        sendMessage,
        retryMessage,
        deleteMessage,
        refetch: fetchMessages,
    };
}
