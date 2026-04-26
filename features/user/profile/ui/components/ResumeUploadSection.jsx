"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Upload, ExternalLink, X, CheckCircle2, AlertCircle } from "lucide-react";

const ACCEPTED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE_MB = 10;

/**
 * Resume/CV section.
 *
 * In edit mode the file is **staged locally** (not uploaded immediately).
 * The parent form collects the staged file via `onFileStaged(file | null)` and
 * uploads it only when the user submits the whole profile form.
 */
export function ResumeUploadSection({
    resumeUrl,
    externalResumeUrl,
    editable = false,
    stagedFile = null,
    onFileStaged,
    onExternalUrlChange,
    onResumeRemove,
    uploading = false,
}) {
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [fileError, setFileError] = useState(null);
    const [removedUpload, setRemovedUpload] = useState(false);

    const effectiveResumeUrl = removedUpload ? null : resumeUrl;
    const hasResume = !!effectiveResumeUrl || !!externalResumeUrl;
    const displayUrl = effectiveResumeUrl || externalResumeUrl;
    const hasUploadedOrStaged = !!effectiveResumeUrl || !!stagedFile;

    const validateAndStage = (file) => {
        setFileError(null);

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setFileError("يُقبل فقط ملفات PDF و DOC و DOCX.");
            return;
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setFileError(`يجب أن يكون حجم الملف أقل من ${MAX_SIZE_MB} ميجابايت.`);
            return;
        }

        // Stage the file locally — no network request yet
        onFileStaged?.(file);
        toast.success(`تم تجهيز السيرة الذاتية "${file.name}" — سيتم الرفع عند الحفظ`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) validateAndStage(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) validateAndStage(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleRemoveStaged = () => {
        onFileStaged?.(null);
        setFileError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.info("تم إزالة السيرة الذاتية المُجهزة");
    };

    const handleRemoveUploaded = () => {
        setRemovedUpload(true);
        onResumeRemove?.();
        toast.info("تم إزالة السيرة الذاتية — سيتم الحذف عند الحفظ");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText size={18} />
                    السيرة الذاتية
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current resume link */}
                {hasResume && !stagedFile && (
                    <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText size={16} className="text-primary shrink-0" />
                            <a
                                href={displayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                            >
                                عرض السيرة الذاتية الحالية
                                <ExternalLink size={12} />
                            </a>
                        </div>
                        {editable && effectiveResumeUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 shrink-0 text-muted-foreground hover:text-red-600"
                                onClick={handleRemoveUploaded}
                            >
                                <X size={14} />
                            </Button>
                        )}
                    </div>
                )}

                {/* Staged file indicator */}
                {stagedFile && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="flex items-center justify-between">
                            <span className="text-sm text-green-700">
                                <strong>{stagedFile.name}</strong>{" "}
                                ({(stagedFile.size / 1024 / 1024).toFixed(2)} ميجابايت) — جاهز للرفع عند الحفظ
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 text-green-700 hover:text-red-600"
                                onClick={handleRemoveStaged}
                            >
                                <X size={14} />
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {editable && (
                    <>
                        {/* Drag-and-drop zone — hidden when a resume is already uploaded or staged */}
                        {!hasUploadedOrStaged && <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${dragOver
                                ? "border-primary bg-primary/5 scale-[1.01]"
                                : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/30"
                                }`}
                        >
                            <Upload size={28} className="mx-auto text-muted-foreground mb-3" />
                            <p className="text-sm font-medium text-foreground">
                                {uploading
                                    ? "جارٍ الرفع..."
                                    : "اسحب وأفلت سيرتك الذاتية هنا، أو انقر للتصفح"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1.5">
                                PDF, DOC, DOCX — الحد الأقصى {MAX_SIZE_MB} ميجابايت
                            </p>
                        </div>}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {fileError && (
                            <Alert variant="destructive" className="py-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{fileError}</AlertDescription>
                            </Alert>
                        )}

                        {/* External URL input */}
                        <div className="space-y-1.5">
                            <Label htmlFor="externalResumeUrl" className="text-sm">
                                أو الصق رابطاً خارجياً
                            </Label>
                            <Input
                                id="externalResumeUrl"
                                type="url"
                                value={externalResumeUrl || ""}
                                onChange={(e) => onExternalUrlChange?.(e.target.value)}
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </>
                )}

                {!editable && !hasResume && (
                    <p className="text-sm text-muted-foreground">لم يتم رفع سيرة ذاتية بعد.</p>
                )}
            </CardContent>
        </Card>
    );
}
