"use client";

/**
 * Reusable form field wrapper with label and error display.
 */
export function FormField({ label, error, children, required }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
        </div>
    );
}
