'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { useFormCreate } from '../model/useFormCreate';
import { FormBuilder } from '../components/FormBuilder/FormBuilder';

export function FormCreatePage() {
    const router = useRouter();
    const {
        title,
        setTitle,
        description,
        setDescription,
        fields,
        setFields,
        savingDraft,
        savingPublish,
        error,
        saveForm,
    } = useFormCreate();

    const handleSave = async (publish) => {
        const result = await saveForm(publish);
        if (!result.success && result.error) {
            alert(result.error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
                        <p className="text-gray-600 mt-1">Build your form by adding fields</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleSave(false)}
                        disabled={savingDraft || savingPublish}
                        className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                    >
                        <Save size={20} />
                        {savingDraft ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        onClick={() => handleSave(true)}
                        disabled={savingDraft || savingPublish}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <Send size={20} />
                        {savingPublish ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                    {error}
                </div>
            )}

            {/* Form Builder */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <FormBuilder
                    title={title}
                    description={description}
                    fields={fields}
                    onTitleChange={setTitle}
                    onDescriptionChange={setDescription}
                    onFieldsChange={setFields}
                />
            </div>
        </div>
    );
}
