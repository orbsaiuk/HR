'use client';

import { format } from 'date-fns';
import { AlertCircle, Clock, RotateCw, X } from 'lucide-react';

export function MessageBubble({ message, isOwn, onRetry, onDelete }) {
    const senderAvatar = message.sender?.avatar;
    const senderInitial = message.sender?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {senderAvatar ? (
                    <img
                        src={senderAvatar}
                        alt={message.sender.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${isOwn ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                        {senderInitial}
                    </div>
                )}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                    className={`rounded-2xl px-4 py-2 ${message.isFailed
                        ? 'bg-red-50 text-gray-900 border border-red-200'
                        : isOwn
                            ? 'bg-blue-500 text-white rounded-br-sm'
                            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                        } ${message.isPending ? 'opacity-60' : ''}`}
                >
                    <p className="text-sm break-words">{message.content}</p>
                </div>

                {/* Timestamp and status */}
                <div className={`flex items-center gap-2 mt-1 px-1 text-xs`}>
                    {message.isPending && (
                        <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-3 h-3 animate-pulse" />
                            <span>Sending...</span>
                        </div>
                    )}

                    {message.isFailed && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-red-600">
                                <AlertCircle className="w-3 h-3" />
                                <span>Failed to send</span>
                            </div>
                            <button
                                onClick={() => onRetry?.(message._id)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                title="Retry"
                            >
                                <RotateCw className="w-3 h-3" />
                                <span>Retry</span>
                            </button>
                            <button
                                onClick={() => onDelete?.(message._id)}
                                className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                                title="Delete"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    )}

                    {!message.isPending && !message.isFailed && (
                        <div className="flex items-center gap-1 text-gray-500">
                            <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
