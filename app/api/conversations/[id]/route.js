import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getConversationById } from '@/features/chat/services/chatService';

// GET a single conversation by ID
export async function GET(request, { params }) {
    try {
        const user = await currentUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id: conversationId } = await params;
        const conversation = await getConversationById(conversationId);

        if (!conversation) {
            return NextResponse.json(
                { error: 'Conversation not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(conversation);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversation', details: error.message },
            { status: 500 }
        );
    }
}
