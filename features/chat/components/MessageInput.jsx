'use client';

import { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
        <div className="border-t border-slate-100 bg-white px-5 py-3">
            <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                {/* Send Button */}
                <Button
                    type="submit"
                    disabled={disabled || !content.trim()}
                    size="icon"
                    className="h-9 w-10 shrink-0 rounded-lg bg-secondary-700 text-white hover:bg-secondary-800 disabled:opacity-40"
                >
                    <Send size={16} />
                </Button>

                {/* Emoji */}
                <button type="button" className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-secondary-700">
                    <Smile size={20} />
                </button>

                {/* Input Field */}
                <div className="flex flex-1 items-center rounded-lg border border-slate-200 bg-slate-50/60 px-3 transition-colors focus-within:border-secondary-300 focus-within:ring-2 focus-within:ring-secondary-100">
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="رد"
                        disabled={disabled}
                        className="flex-1 bg-transparent py-2 text-sm text-right outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
                        dir="rtl"
                    />
                    <button type="button" className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-secondary-700">
                        <Paperclip size={16} />
                    </button>
                </div>
            </form>
        </div>
    );
}
