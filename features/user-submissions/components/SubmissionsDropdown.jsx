/**
 * Submissions notification dropdown component
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, FileText, Clock } from 'lucide-react';
import { useUserSubmissions } from '../model/useUserSubmissions';
import { StatusBadge } from '@/features/responses/components/StatusBadge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';

export function SubmissionsDropdown() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { submissions, loading, unreadCount, markAsRead, markAllAsRead } = useUserSubmissions();

    const handleSubmissionClick = async (submission) => {
        if (submission.statusUpdated && !submission.statusViewed) {
            await markAsRead(submission._id);
        }
    };

    const handleMarkAllRead = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await markAllAsRead();
    };

    const getNotificationMessage = (submission) => {
        const formName = submission.form?.title || 'Untitled Form';
        const status = submission.status;

        if (submission.statusUpdated && !submission.statusViewed) {
            // New status update
            switch (status) {
                case 'approved':
                    return `Your form "${formName}" has been approved`;
                case 'rejected':
                    return `Your form "${formName}" has been rejected`;
                case 'pending':
                    return `Your form "${formName}" is pending review`;
                case 'reviewed':
                    return `Your form "${formName}" has been reviewed`;
                default:
                    return `Your form "${formName}" status has been updated`;
            }
        }

        // Default message for older submissions
        return `Submission for "${formName}"`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    aria-label="Submissions"
                >
                    <Bell size={20} className={unreadCount > 0 ? 'fill-red-500 text-red-500' : ''} />
                    {unreadCount > 0 && (
                        <>
                            {/* Notification count badge */}
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1.5 flex items-center justify-center z-10"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                            {/* Pulsing indicator ring around badge */}
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            </span>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-96 max-h-[calc(100vh-100px)] p-0"
                sideOffset={8}
            >
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                    <div>
                        <DropdownMenuLabel className="p-0 text-base">My Submissions</DropdownMenuLabel>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {unreadCount > 0 ? `${unreadCount} new update${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="h-auto py-1 px-2 text-xs"
                        >
                            <CheckCheck size={14} className="mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Submissions List */}
                <div className="max-h-[400px] overflow-y-auto">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-2 text-sm">Loading...</p>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <FileText className="mx-auto mb-2 opacity-30" size={32} />
                            <p className="text-sm">No submissions yet</p>
                        </div>
                    ) : (
                        submissions.map((submission) => {
                            const notificationMessage = getNotificationMessage(submission);
                            const isUnread = submission.statusUpdated && !submission.statusViewed;

                            return (
                                <div
                                    key={submission._id}
                                    onClick={() => handleSubmissionClick(submission)}
                                    className={`p-4 cursor-pointer hover:bg-accent ${isUnread
                                        ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900'
                                        : ''
                                        }`}
                                >
                                    <div className="flex items-start gap-3 w-full">
                                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${isUnread
                                            ? 'bg-blue-600'
                                            : 'bg-transparent'
                                            }`}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className={`text-sm ${isUnread ? 'font-semibold' : 'font-medium'}`}>
                                                    {notificationMessage}
                                                </p>
                                                <StatusBadge status={submission.status} />
                                            </div>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDate(submission.updatedAt)}
                                            </p>
                                            {submission.status === 'rejected' && submission.rejectionReason && (
                                                <p className="text-xs text-red-800 mt-1.5 p-2 bg-red-50 rounded border-l-2 border-red-300">
                                                    <span className="font-medium">Rejection Reason:</span> {submission.rejectionReason}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                {submissions.length > 0 && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                setIsOpen(false);
                                router.push('/user/submissions');
                            }}
                            className="p-3 justify-center text-sm font-medium text-primary cursor-pointer"
                        >
                            View all submissions
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
