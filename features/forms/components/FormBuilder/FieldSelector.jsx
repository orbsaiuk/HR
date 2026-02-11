'use client'

const fieldTypes = [
    { type: 'text', label: 'Text', description: 'Short text input' },
    { type: 'textarea', label: 'Textarea', description: 'Long text input' },
    { type: 'number', label: 'Number', description: 'Numeric input' },
    { type: 'email', label: 'Email', description: 'Email address' },
    { type: 'multipleChoice', label: 'Multiple Choice', description: 'Select multiple' },
    { type: 'dropdown', label: 'Dropdown', description: 'Select from list' },
    { type: 'date', label: 'Date', description: 'Date picker' },
    { type: 'time', label: 'Time', description: 'Time picker' },
    { type: 'datetime', label: 'Date & Time', description: 'Date and time' },
    { type: 'file', label: 'File Upload', description: 'Upload files' },
]

export function FieldSelector({ onAddField }) {
    return (
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">Add Field</h3>
            <div className="grid grid-cols-2 gap-2">
                {fieldTypes.map((field) => (
                    <button
                        key={field.type}
                        onClick={() => onAddField(field.type)}
                        className="cursor-pointer p-3 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    >
                        <div className="font-medium">{field.label}</div>
                        <div className="text-sm text-gray-500">{field.description}</div>
                    </button>
                ))}
            </div>
        </div>
    )
}

