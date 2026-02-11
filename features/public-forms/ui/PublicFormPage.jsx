/**
 * Public form page component
 */

'use client';

import { usePublicForm } from '../model/usePublicForm';
import { FormViewer } from '@/features/forms/components/FormViewer/FormViewer.jsx';
import { Loading } from '@/shared/components/feedback/Loading';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export function PublicFormPage({ formId }) {
    const { form, loading, submitted, alreadySubmitted, error, submitting, submitForm, goHome, refetch } = usePublicForm(formId);

    if (loading) return <Loading fullPage />;

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (alreadySubmitted) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <Info className="mx-auto text-blue-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Already Submitted</h2>
                    <p className="text-gray-600 mb-4">
                        You have already submitted a response to this form.
                    </p>
                    <button
                        onClick={goHome}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-4">
                        Your response has been submitted successfully.
                    </p>
                    <button
                        onClick={goHome}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
                {form.description && (
                    <p className="text-gray-600 mb-6">{form.description}</p>
                )}
                <FormViewer form={form} onSubmit={submitForm} disabled={submitting} />
            </div>
        </div>
    );
}
