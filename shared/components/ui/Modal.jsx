'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className={`relative bg-white rounded-lg shadow-lg ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>
                <div className="p-6">{children}</div>
                {footer && (
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
