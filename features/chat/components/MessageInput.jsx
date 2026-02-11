'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export function MessageInput({ onSend, disabled }) {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSend(content.trim());
            setContent('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type a message..."
                    disabled={disabled}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <button
                    type="submit"
                    disabled={disabled || !content.trim()}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                </button>
            </div>
        </form>
    );
}
