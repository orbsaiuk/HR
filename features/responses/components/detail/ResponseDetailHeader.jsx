'use client';

import { ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';

export function ResponseDetailHeader({ 
    formTitle, 
    onBack, 
    onSendMessage, 
    onDelete,
    isSending 
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Response Details</h1>
                    <p className="text-gray-600 mt-1">{formTitle || 'Form'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onSendMessage}
                    disabled={isSending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <MessageSquare size={20} />
                    {isSending ? 'Opening...' : 'Send Message'}
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <Trash2 size={20} />
                    Delete
                </button>
            </div>
        </div>
    );
}
