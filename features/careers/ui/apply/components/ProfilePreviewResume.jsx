"use client";

import { FileText, ExternalLink } from "lucide-react";

export function ProfilePreviewResume({ resumeUrl }) {
    if (!resumeUrl) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <FileText size={14} />
                Resume
            </h4>
            <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
                View Resume
                <ExternalLink size={12} />
            </a>
        </div>
    );
}
