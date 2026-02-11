/**
 * Shared conversation card component
 * Used in both dashboard and user messages pages
 */

import { Clock } from 'lucide-react';
import { formatRelativeDate } from '@/shared/utils/dateUtils';

export function ConversationCard({ conversation, participant, onClick }) {
    const hasMessages = conversation.lastMessage;
    const participantAvatar = participant?.avatar;
    const participantInitial = participant?.name?.charAt(0).toUpperCase() || 'U';

    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {participantAvatar ? (
                    <img
                        src={participantAvatar}
                        alt={participant?.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-lg">
                            {participantInitial}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className='flex items-center gap-2'>
                        <p className="font-semibold text-gray-900 truncate">
                            {participant?.name || 'Unknown User'}
                        </p>
                        {/* Related form */}
                        {conversation.relatedForm && (
                            <p className="text-sm text-blue-600 font-medium">
                                📋 {conversation.relatedForm.title}
                            </p>
                        )}
                    </div>
                    {hasMessages && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
                            <Clock size={12} />
                            <span>{formatRelativeDate(conversation.lastMessageAt)}</span>
                        </div>
                    )}
                </div>

                <div>
                    {/* Last message */}
                    <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                        }`}>
                        {hasMessages
                            ? conversation.lastMessage
                            : 'Start a conversation'
                        }
                    </p>
                </div>
            </div>

            {/* Unread badge */}
            {conversation.unreadCount > 0 && (
                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </div>
            )}
        </button>
    );
}
