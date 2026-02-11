/**
 * Response answers display component
 */

'use client';

import { FileText, Calendar, CheckSquare, Download } from 'lucide-react';
import { getFileUrlFromAnswer } from '@/lib/sanityFileUrl';

export function ResponseAnswers({ form, response }) {
    const getAnswerData = (fieldId) => {
        return response?.answers?.find(a => a.fieldId === fieldId);
    };

    const renderAnswerValue = (answer, field) => {
        if (!answer || !answer.value) {
            return (
                <div className="flex items-center gap-2 text-gray-400 italic">
                    <span>No answer provided</span>
                </div>
            );
        }

        const fieldType = answer.fieldType || field?.type || 'text';

        // Handle multipleChoice (array values)
        if (fieldType === 'multipleChoice') {
            try {
                const values = JSON.parse(answer.value);
                if (Array.isArray(values) && values.length > 0) {
                    return (
                        <div className="flex flex-wrap gap-2">
                            {values.map((val, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                                    <CheckSquare size={14} />
                                    {val}
                                </span>
                            ))}
                        </div>
                    );
                }
            } catch (e) {
                // If not JSON, display as is
            }
        }

        // Handle file uploads with preview
        if (fieldType === 'file' && answer.fileAsset) {
            const fileUrl = getFileUrlFromAnswer(answer);
            const fileName = answer.value;
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);

            return (
                <div className="space-y-3">
                    {isImage && fileUrl && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                                src={fileUrl}
                                alt={fileName}
                                className="max-w-full h-auto max-h-96 object-contain mx-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{fileName}</p>
                            <p className="text-sm text-gray-500">
                                {isImage ? 'Image file' : 'Document file'}
                            </p>
                        </div>
                        {fileUrl && (
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <Download size={16} />
                                Download
                            </a>
                        )}
                    </div>
                </div>
            );
        }

        // Handle date/time fields
        if (fieldType === 'date' || fieldType === 'datetime' || fieldType === 'time') {
            return (
                <div className="flex items-center gap-2 text-gray-900">
                    <Calendar size={18} className="text-blue-600" />
                    <span className="font-medium">{answer.value}</span>
                </div>
            );
        }

        // Handle dropdown
        if (fieldType === 'dropdown') {
            return (
                <span className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium border border-green-200">
                    {answer.value}
                </span>
            );
        }

        // Handle textarea (multiline)
        if (fieldType === 'textarea') {
            return (
                <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed m-0">
                        {answer.value}
                    </p>
                </div>
            );
        }

        // Handle email
        if (fieldType === 'email') {
            return (
                <a
                    href={`mailto:${answer.value}`}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                    {answer.value}
                </a>
            );
        }

        // Handle number
        if (fieldType === 'number') {
            return (
                <span className="text-gray-900 font-semibold text-lg">
                    {answer.value}
                </span>
            );
        }

        // Default: plain text
        return <span className="text-gray-900 font-medium">{answer.value}</span>;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Form Responses</h2>
                <p className="text-gray-600 mt-1">Detailed answers from the respondent</p>
            </div>
            <div className="p-6">
                {form?.fields && form.fields.length > 0 ? (
                    <div className="space-y-8">
                        {form.fields.map((field, index) => {
                            const answer = getAnswerData(field._key);
                            return (
                                <div key={field._key} className="group">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                                    {field.label}
                                                    {field.required && (
                                                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded font-medium">
                                                            Required
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium uppercase">
                                                        {field.type}
                                                    </span>
                                                    {field.placeholder && (
                                                        <span className="text-sm text-gray-500">
                                                            • {field.placeholder}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-5 border border-gray-200">
                                                {renderAnswerValue(answer, field)}
                                            </div>
                                        </div>
                                    </div>
                                    {index < form.fields.length - 1 && (
                                        <div className="ml-4 mt-6 border-l-2 border-gray-200 h-4"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FileText className="mx-auto text-gray-300 mb-3" size={48} />
                        <p className="text-gray-500 text-lg">No fields in this form</p>
                    </div>
                )}
            </div>
        </div>
    );
}
