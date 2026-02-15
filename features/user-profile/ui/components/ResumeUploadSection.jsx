"use client";

import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, ExternalLink, X } from "lucide-react";

const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE_MB = 10;

export function ResumeUploadSection({
    resumeUrl,
    externalResumeUrl,
    editable = false,
    onUpload,
    onExternalUrlChange,
    uploading = false,
}) {
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileError, setFileError] = useState(null);

    const hasResume = !!resumeUrl || !!externalResumeUrl;
    const displayUrl = resumeUrl || externalResumeUrl;

    const validateAndUpload = (file) => {
        setFileError(null);

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setFileError("Only PDF, DOC, and DOCX files are accepted.");
            return;
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setFileError(`File must be smaller than ${MAX_SIZE_MB}MB.`);
            return;
        }

        onUpload?.(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) validateAndUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndUpload(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText size={18} />
                    Resume / CV
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Current resume link */}
                {hasResume && (
                    <div className="flex items-center gap-2 text-sm">
                        <FileText size={16} className="text-blue-600" />
                        <a
                            href={displayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                            View current resume
                            <ExternalLink size={12} />
                        </a>
                    </div>
                )}

                {editable && (
                    <>
                        {/* Drag-and-drop zone */}
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver
                                ? "border-blue-400 bg-blue-50"
                                : "border-gray-300 hover:border-gray-400"
                                }`}
                        >
                            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                                {uploading
                                    ? "Uploading..."
                                    : "Drag & drop your resume here, or click to browse"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                PDF, DOC, DOCX — max {MAX_SIZE_MB}MB
                            </p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {fileError && (
                            <p className="text-sm text-red-600">{fileError}</p>
                        )}

                        {/* External URL input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Or paste an external link
                            </label>
                            <input
                                type="url"
                                value={externalResumeUrl || ""}
                                onChange={(e) => onExternalUrlChange?.(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </>
                )}

                {!editable && !hasResume && (
                    <p className="text-sm text-gray-400">No resume uploaded yet.</p>
                )}
            </CardContent>
        </Card>
    );
}
