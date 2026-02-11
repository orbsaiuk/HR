'use client';

import { useState } from 'react';
import { 
    Calendar, 
    CheckSquare, 
    Download, 
    Mail, 
    Hash, 
    Maximize2,
    X
} from 'lucide-react';
import { getFileUrlFromAnswer } from '@/lib/sanityFileUrl';
import { Badge } from '@/components/ui/badge';

function ImagePreviewModal({ isOpen, onClose, imageUrl, fileName }) {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative max-w-4xl max-h-[90vh] w-full mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-2 text-white/80 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>
                <img
                    src={imageUrl}
                    alt={fileName}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                <p className="text-center text-white/70 text-sm mt-3">{fileName}</p>
            </div>
        </div>
    );
}

export function CompareAnswerCell({ answer, field }) {
    const [previewImage, setPreviewImage] = useState(null);
    if (!answer || !answer.value) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground italic text-sm py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
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
                    <div className="flex flex-wrap gap-1.5 py-1">
                        {values.map((val, idx) => (
                            <Badge 
                                key={idx} 
                                variant="secondary" 
                                className="text-xs font-medium gap-1 bg-primary/10 text-primary border-0 hover:bg-primary/20 transition-colors"
                            >
                                <CheckSquare size={10} />
                                {val}
                            </Badge>
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
            <div className="space-y-2 py-1">
                {isImage && fileUrl && (
                    <div 
                        className="relative rounded-lg overflow-hidden border bg-muted/50 group/image cursor-pointer"
                        onClick={() => setPreviewImage({ url: fileUrl, name: fileName })}
                    >
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className="max-w-full h-auto max-h-32 object-contain mx-auto transition-transform group-hover/image:scale-105"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors flex items-center justify-center">
                            <Maximize2 className="opacity-0 group-hover/image:opacity-70 text-white drop-shadow-lg transition-opacity" size={20} />
                        </div>
                    </div>
                )}
                <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs font-medium group/link transition-colors"
                >
                    <Download size={12} className="group-hover/link:animate-bounce" />
                    <span className="truncate max-w-35 group-hover/link:underline">{fileName}</span>
                </a>
                <ImagePreviewModal
                    isOpen={!!previewImage}
                    onClose={() => setPreviewImage(null)}
                    imageUrl={previewImage?.url}
                    fileName={previewImage?.name}
                />
            </div>
        );
    }

    // Handle date/time fields
    if (fieldType === 'date' || fieldType === 'datetime' || fieldType === 'time') {
        return (
            <div className="inline-flex items-center gap-2 text-sm bg-muted/50 rounded-md px-2.5 py-1.5">
                <Calendar size={14} className="text-primary shrink-0" />
                <span className="font-medium">{answer.value}</span>
            </div>
        );
    }

    // Handle dropdown
    if (fieldType === 'dropdown') {
        return (
            <Badge variant="outline" className="text-xs font-medium px-2.5 py-1">
                {answer.value}
            </Badge>
        );
    }

    // Handle textarea (multiline)
    if (fieldType === 'textarea') {
        return (
            <p className="text-sm whitespace-pre-wrap leading-relaxed line-clamp-4">
                {answer.value}
            </p>
        );
    }

    // Handle email
    if (fieldType === 'email') {
        return (
            <a
                href={`mailto:${answer.value}`}
                className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 text-sm truncate transition-colors group"
            >
                <Mail size={14} className="shrink-0" />
                <span className="group-hover:underline">{answer.value}</span>
            </a>
        );
    }

    // Handle number
    if (fieldType === 'number') {
        return (
            <span className="inline-flex items-center gap-1.5 font-semibold text-base bg-muted/50 rounded-md px-2.5 py-1">
                <Hash size={14} className="text-muted-foreground" />
                {answer.value}
            </span>
        );
    }

    // Default: plain text
    return <span className="text-sm leading-relaxed">{answer.value}</span>;
}
