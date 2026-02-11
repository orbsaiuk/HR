'use client'
import { useState, useEffect } from 'react';
import { userSubmissionsApi } from '../api/userSubmissionsApi';

export function useUserSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userSubmissionsApi.getMySubmissions();
            // Sort by latest update (most recent first)
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a._updatedAt || a.submittedAt);
                const dateB = new Date(b.updatedAt || b._updatedAt || b.submittedAt);
                return dateB - dateA; // Descending order (newest first)
            });

            setSubmissions(sortedData);

            // Count unread submissions (status changed and not viewed)
            const unread = sortedData.filter(s => s.statusUpdated && !s.statusViewed).length;

            setUnreadCount(unread);
        } catch (err) {
            setError(err.message || 'Failed to fetch submissions');
            console.error('Error fetching submissions:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await userSubmissionsApi.markAsRead(id);
            await fetchSubmissions();
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await userSubmissionsApi.markAllAsRead();
            await fetchSubmissions();
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    useEffect(() => {
        fetchSubmissions();

        // Poll for updates every 30 seconds
        const interval = setInterval(fetchSubmissions, 30000);

        return () => clearInterval(interval);
    }, []);

    return {
        submissions,
        loading,
        error,
        unreadCount,
        refetch: fetchSubmissions,
        markAsRead,
        markAllAsRead,
    };
}
