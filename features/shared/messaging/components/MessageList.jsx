'use client';

import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { MessageBubble } from './MessageBubble.jsx';

export function MessageList({ messages, currentUserId, onRetry, onDelete }) {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Group messages by day
    const groupedMessages = [];
    let lastDate = null;

    messages.forEach((message) => {
        const messageDate = new Date(message.createdAt).toDateString();
        if (messageDate !== lastDate) {
            groupedMessages.push({ type: 'divider', date: message.createdAt });
            lastDate = messageDate;
        }
        groupedMessages.push({ type: 'message', data: message });
    });

    const getDayLabel = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'أمس';
        return date.toLocaleDateString('ar-EG', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="flex-1 space-y-1">
            {groupedMessages.map((item, index) => {
                if (item.type === 'divider') {
                    return (
                        <div
                            key={`divider-${index}`}
                            className="my-5 flex items-center justify-center"
                        >
                            <span className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs text-muted-foreground shadow-sm">
                                <ChevronDown size={14} />
                                {getDayLabel(item.date)}
                            </span>
                        </div>
                    );
                }
                return (
                    <MessageBubble
                        key={item.data._id}
                        message={item.data}
                        isOwn={item.data.sender._id === currentUserId}
                        onRetry={onRetry}
                        onDelete={onDelete}
                    />
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}
