/**
 * Form share page component
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Share2 } from 'lucide-react';
import { useFormDetail } from '../model/useFormDetail';
import { Loading } from '@/shared/components/feedback/Loading';
import { Error } from '@/shared/components/feedback/Error';

export function FormSharePage({ formId }) {
    const router = useRouter();
    const { form, loading, error, refetch } = useFormDetail(formId);
    const [copied, setCopied] = useState(false);

    const shareUrl = form ? `${typeof window !== 'undefined' ? window.location.origin : ''}/forms/${form._id}` : '';

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            alert('Failed to copy link');
        }
    };

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} onRetry={refetch} />;
    if (!form) return <Error message="Form not found" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Share Form</h1>
                    <p className="text-gray-600 mt-1">{form.title}</p>
                </div>
            </div>

            {/* Share Link */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Share2 size={24} className="text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Share Link</h2>
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                    Anyone with this link can view and submit the form.
                </p>
            </div>

            {/* Embed Code */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Embed Form</h2>
                <p className="text-gray-600 mb-4">
                    Copy this code to embed the form on your website:
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm">
                        {`<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
                    </code>
                </div>
            </div>
        </div>
    );
}
