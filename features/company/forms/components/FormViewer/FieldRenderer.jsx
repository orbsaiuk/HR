'use client'

export function FieldRenderer({ field, value, onChange, onFileChange, error }) {
    const hasError = !!error

    return (
        <div className="space-y-2">
            <label className="block font-medium">
                {field.label || 'Untitled Field'}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === 'text' && (
                <input
                    type="text"
                    placeholder={field.placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'textarea' && (
                <textarea
                    placeholder={field.placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    rows={4}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'number' && (
                <input
                    type="number"
                    placeholder={field.placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'email' && (
                <input
                    type="email"
                    placeholder={field.placeholder}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'dropdown' && (
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                >
                    <option value="">Select an option</option>
                    {(field.options || []).map((option, i) => (
                        <option key={i} value={option}>{option}</option>
                    ))}
                </select>
            )}

            {field.type === 'multipleChoice' && (
                <div className="space-y-2">
                    {(field.options || []).map((option, i) => (
                        <label key={i} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={(Array.isArray(value) ? value : []).includes(option)}
                                onChange={(e) => {
                                    const currentValues = Array.isArray(value) ? value : []
                                    if (e.target.checked) {
                                        onChange([...currentValues, option])
                                    } else {
                                        onChange(currentValues.filter(v => v !== option))
                                    }
                                }}
                                className="w-4 h-4"
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            )}

            {field.type === 'date' && (
                <input
                    type="date"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'time' && (
                <input
                    type="time"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'datetime' && (
                <input
                    type="datetime-local"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                        }`}
                />
            )}

            {field.type === 'file' && (
                <div>
                    <input
                        type="file"
                        accept={
                            field.fileType === 'image'
                                ? 'image/*'
                                : field.fileType === 'document'
                                    ? '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx'
                                    : undefined
                        }
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (onFileChange) {
                                onFileChange(file)
                            }
                        }}
                        className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none ${hasError ? 'border-red-500' : ''
                            }`}
                    />
                    {value && (
                        <p className="text-sm text-gray-600 mt-2">Selected: {value}</p>
                    )}
                    {field.fileType === 'image' && (
                        <p className="text-xs text-gray-500 mt-1">Accepts: Images only</p>
                    )}
                    {field.fileType === 'document' && (
                        <p className="text-xs text-gray-500 mt-1">Accepts: PDF, Word, Excel, PowerPoint, Text files</p>
                    )}
                </div>
            )}

            {hasError && (
                <p className="text-red-500 text-sm">{error}</p>
            )}
        </div>
    )
}
