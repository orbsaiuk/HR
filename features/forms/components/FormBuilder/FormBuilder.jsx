'use client'

import { useState } from 'react'
import { FieldSelector } from './FieldSelector'
import { FieldList } from './FieldList'
import { FieldEditor } from './FieldEditor'
import { FormPreview } from './FormPreview'

export function FormBuilder({
    title,
    description,
    fields,
    onTitleChange,
    onDescriptionChange,
    onFieldsChange
}) {
    const [selectedField, setSelectedField] = useState(null)
    const [showPreview, setShowPreview] = useState(false)

    const addField = (type) => {
        const newField = {
            _key: `field-${Date.now()}`,
            type,
            label: '',
            required: false,
            order: fields.length,
        }
        onFieldsChange([...fields, newField])
        setSelectedField(newField)
    }

    const updateField = (key, updates) => {
        onFieldsChange(fields.map(f =>
            f._key === key ? { ...f, ...updates } : f
        ))
        if (selectedField?._key === key) {
            setSelectedField({ ...selectedField, ...updates })
        }
    }

    const deleteField = (key) => {
        onFieldsChange(fields.filter(f => f._key !== key))
        if (selectedField?._key === key) {
            setSelectedField(null)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
                <div>
                    <input
                        type="text"
                        placeholder="Form Title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="text-2xl font-bold w-full border-b-2 border-gray-200 focus:border-blue-500 outline-none pb-2"
                    />
                    <textarea
                        placeholder="Form Description"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        className="mt-4 w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={3}
                    />
                </div>

                <FieldSelector onAddField={addField} />

                <FieldList
                    fields={fields}
                    onSelectField={setSelectedField}
                    selectedFieldKey={selectedField?._key}
                    onDeleteField={deleteField}
                />

                {selectedField && (
                    <FieldEditor
                        field={selectedField}
                        onUpdate={(updates) => updateField(selectedField._key, updates)}
                    />
                )}
            </div>

            <div className="sticky top-4">
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setShowPreview(false)}
                        className={`cursor-pointer flex-1 py-2 px-4 rounded-lg ${!showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => setShowPreview(true)}
                        className={`cursor-pointer flex-1 py-2 px-4 rounded-lg ${showPreview ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Preview
                    </button>
                </div>

                {showPreview ? (
                    <FormPreview title={title} description={description} fields={fields} />
                ) : (
                    <div className="bg-gray-50 rounded-lg p-6">
                        <p className="text-gray-500 text-center">
                            Select a field to edit or add a new field
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
