'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';
import { chatApi } from '@/features/chat/api/chatApi';

export function ResponseDetail({ response, onDelete }) {
    const router = useRouter();
    const [isSending, setIsSending] = useState(false);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this response?')) {
            onDelete(response._id);
        }
    };

    const handleSendMessage = async () => {
        try {
            setIsSending(true);
            // Create or get conversation with the user
            const conversation = await chatApi.createConversation({
                userId: response.user._id || response.user.id,
                userName: response.user.name,
                userEmail: response.user.email,
            });

            // Navigate to the conversation page
            router.push(`/dashboard/conversations/${conversation._id}`);
        } catch (error) {
            console.error('Error creating conversation:', error);
            alert('Failed to start conversation. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    const formatAnswerValue = (value) => {
        if (value === null || value === undefined || value === '') {
            return <span className="text-gray-400 italic">No answer</span>;
        }

        if (Array.isArray(value)) {
            return (
                <ul className="list-disc list-inside space-y-1">
                    {value.map((item, index) => (
                        <li key={index} className="text-gray-700">
                            {item}
                        </li>
                    ))}
                </ul>
            );
        }

        return <span className="text-gray-700">{String(value)}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Response Details
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Respondent</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {response.user.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-gray-700">{response.user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Submitted</p>
                                    <p className="text-gray-700">
                                        {format(new Date(response.submittedAt), 'MMMM dd, yyyy at HH:mm')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSendMessage}
                            disabled={isSending}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <MessageSquare size={20} />
                            {isSending ? 'Opening...' : 'Send Message'}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Delete Response
                        </button>
                    </div>
                </div>
            </div>

            {/* Answers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Answers</h3>
                {response.answers && response.answers.length > 0 ? (
                    <div className="space-y-6">
                        {response.answers.map((answer) => (
                            <div
                                key={answer._key}
                                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                            >
                                <div className="mb-2">
                                    <p className="text-sm font-medium text-gray-500 mb-1">
                                        Field ID: {answer.fieldId}
                                    </p>
                                    <h4 className="text-lg font-medium text-gray-900">
                                        {answer.label || 'Untitled Field'}
                                    </h4>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {formatAnswerValue(answer.value)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No answers recorded for this response.</p>
                    </div>
                )}
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Response ID: {response._id}</span>
                    <span>
                        Last Updated: {format(new Date(response.updatedAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                </div>
            </div>
        </div>
    );
}
