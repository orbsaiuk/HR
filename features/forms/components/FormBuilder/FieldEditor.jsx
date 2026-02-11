'use client'
import { X, Plus } from 'lucide-react'

export function FieldEditor({ field, onUpdate }) {
    const isChoiceField = [
        'multipleChoice',
        'dropdown',
    ].includes(field.type)

    const isFileField = field.type === 'file'

    const handleOptionChange = (index, value) => {
        const newOptions = [...(field.options || [])]
        newOptions[index] = value
        onUpdate({ options: newOptions })
    }

    const handleAddOption = () => {
        const newOptions = [...(field.options || []), '']
        onUpdate({ options: newOptions })
    }

    const handleRemoveOption = (index) => {
        const newOptions = (field.options || []).filter((_, i) => i !== index)
        onUpdate({ options: newOptions })
    }

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-semibold text-lg">Edit Field</h3>

            <div>
                <label className="block text-sm font-medium mb-1">Label</label>
                <input
                    type="text"
                    value={field.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Field label"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Placeholder</label>
                <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => onUpdate({ placeholder: e.target.value })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Placeholder text"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onUpdate({ required: e.target.checked })}
                    className="w-4 h-4 cursor-pointer"
                    id="required"
                />
                <label htmlFor="required" className="text-sm font-medium">
                    Required field
                </label>
            </div>

            {isFileField && (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        File Type
                    </label>
                    <select
                        value={field.fileType || 'any'}
                        onChange={(e) => onUpdate({ fileType: e.target.value })}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="any">Any File</option>
                        <option value="image">Images Only</option>
                        <option value="document">Documents Only</option>
                    </select>
                </div>
            )}

            {isChoiceField && (
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Options
                    </label>
                    <div className="space-y-2">
                        {(field.options || []).map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">{index + 1}.</span>
                                <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder={`Option ${index + 1}`}
                                />
                                {(field.options || []).length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveOption(index)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        aria-label="Remove option"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                        >
                            <Plus size={16} />
                            Add option
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

