'use client'

import { useState } from 'react'
import { FieldRenderer } from './FieldRenderer'

export function FormViewer({ form, onSubmit }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [formData, setFormData] = useState({})
    const [files, setFiles] = useState({})
    const [errors, setErrors] = useState({})

    const handleChange = (fieldKey, value) => {
        setFormData(prev => ({ ...prev, [fieldKey]: value }))
        // Clear error for this field
        if (errors[fieldKey]) {
            setErrors(prev => ({ ...prev, [fieldKey]: null }))
        }
    }

    const handleFileChange = (fieldKey, file) => {
        setFiles(prev => ({ ...prev, [fieldKey]: file }))
        setFormData(prev => ({ ...prev, [fieldKey]: file?.name || '' }))
        // Clear error for this field
        if (errors[fieldKey]) {
            setErrors(prev => ({ ...prev, [fieldKey]: null }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        form.fields.forEach(field => {
            if (field.required && !formData[field._key]) {
                newErrors[field._key] = `${field.label || 'This field'} is required`
            }

            if (field.type === 'email' && formData[field._key]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(formData[field._key])) {
                    newErrors[field._key] = 'Invalid email address'
                }
            }
        })

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(formData, files)
            setSubmitSuccess(true)
        } catch (error) {
            console.error('Error submitting form:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (submitSuccess) {
        return (
            <div className="text-center py-12">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
                <p className="text-gray-600">Your response has been submitted successfully.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleFormSubmit} className="space-y-6">
            {form.fields.map((field) => (
                <FieldRenderer
                    key={field._key}
                    field={field}
                    value={formData[field._key]}
                    onChange={(value) => handleChange(field._key, value)}
                    onFileChange={(file) => handleFileChange(field._key, file)}
                    error={errors[field._key]}
                />
            ))}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    )
}
