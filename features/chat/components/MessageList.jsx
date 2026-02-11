'use client';

import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble.jsx';

export function MessageList({ messages, currentUserId, onRetry, onDelete }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map((message) => (
                <MessageBubble
                    key={message._id}
                    message={message}
                    isOwn={message.sender._id === currentUserId}
                    onRetry={onRetry}
                    onDelete={onDelete}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
