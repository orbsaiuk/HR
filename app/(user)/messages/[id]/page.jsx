/**
 * User conversation detail page
 */

'use client';

import { use } from 'react';
import { ConversationPage } from '@/features/chat/ui/ConversationPage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useSanityUser } from '@/features/auth/hooks/useSanityUser';
import { Loading } from '@/shared/components/feedback/Loading';

export default function Page({ params }) {
    const unwrappedParams = use(params);
    const { isSignedIn } = useAuth();
    const { sanityUser, loading } = useSanityUser();

    if (!isSignedIn || loading) {
        return <Loading fullPage />;
    }

    if (!sanityUser?._id) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">User not found</p>
            </div>
        );
    }

    return (
        <ConversationPage
            conversationId={unwrappedParams.id}
            currentUserId={sanityUser._id}
        />
    );
}
