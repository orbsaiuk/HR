'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useSanityUser() {
    const { user } = useUser();
    const [sanityUser, setSanityUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchSanityUser() {
            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const role = user.publicMetadata?.role || 'user';
                const response = await fetch(`/api/auth/sanity-user?clerkId=${user.id}&type=${role}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch Sanity user');
                }

                const data = await response.json();

                if (data.sanityUserId) {
                    setSanityUser({ _id: data.sanityUserId });
                }
            } catch (err) {
                console.error('Error fetching Sanity user:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSanityUser();
    }, [user?.id]);

    return {
        sanityUser,
        loading,
        error,
    };
}
