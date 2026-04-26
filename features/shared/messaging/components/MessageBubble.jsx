'use client';

import { AlertCircle, Clock, RotateCw, X } from 'lucide-react';
import { formatRelativeDateAr } from '@/shared/utils/dateUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function MessageBubble({ message, isOwn, onRetry, onDelete }) {
    const senderName = isOwn ? 'انت' : (message.sender?.name || 'مستخدم');

    return (
        <div
            className={`mb-4 flex max-w-[75%] gap-3 ${
                isOwn ? 'me-auto flex-row-reverse' : 'ms-auto flex-row'
            }`}
        >
            {/* Avatar */}
            <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage src={message.sender?.avatar} alt={message.sender?.name} />
                <AvatarFallback
                    className={`text-xs font-semibold text-white ${
                        isOwn
                            ? 'bg-gradient-to-br from-primary-400 to-primary-600'
                            : 'bg-gradient-to-br from-secondary-400 to-secondary-700'
                    }`}
                >
                    {message.sender?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>

            {/* Body */}
            <div className="flex flex-col">
                <span className="mb-1 text-xs font-semibold text-slate-600">
                    {senderName}
                </span>

                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        message.isFailed
                            ? 'border border-red-200 bg-red-50 text-slate-900'
                            : isOwn
                                ? 'rounded-ss-sm bg-slate-100 text-slate-900'
                                : 'rounded-se-sm border border-slate-200 bg-white text-slate-900'
                    } ${message.isPending ? 'opacity-50' : ''}`}
                >
                    <p className="m-0 break-words">{message.content}</p>
                </div>

                {/* Status / Time */}
                {message.isPending && (
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 animate-pulse" />
                        <span>جاري الإرسال...</span>
                    </div>
                )}

                {message.isFailed && (
                    <div className="mt-1 flex items-center gap-2.5">
                        <span className="flex items-center gap-1 text-xs text-red-600">
                            <AlertCircle size={13} />
                            فشل الإرسال
                        </span>
                        <button
                            onClick={() => onRetry?.(message._id)}
                            className="flex items-center gap-0.5 text-xs font-medium text-secondary-700 hover:underline"
                        >
                            <RotateCw size={13} />
                            إعادة المحاولة
                        </button>
                        <button
                            onClick={() => onDelete?.(message._id)}
                            className="text-muted-foreground hover:text-slate-600"
                        >
                            <X size={13} />
                        </button>
                    </div>
                )}

                {!message.isPending && !message.isFailed && (
                    <span className="mt-1 text-[11px] text-muted-foreground">
                        {formatRelativeDateAr(message.createdAt)}
                    </span>
                )}
            </div>
        </div>
    );
}
