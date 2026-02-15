"use client";

import { Link2, Linkedin, Globe } from "lucide-react";

export function ProfileSnapshotLinks({ snapshot }) {
    const { linkedinUrl, portfolioUrl } = snapshot;

    if (!linkedinUrl && !portfolioUrl) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <Link2 size={14} />
                Links
            </h4>
            <div className="flex flex-wrap gap-3">
                {linkedinUrl && (
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        <Linkedin size={14} />
                        LinkedIn
                    </a>
                )}
                {portfolioUrl && (
                    <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                        <Globe size={14} />
                        Portfolio
                    </a>
                )}
            </div>
        </div>
    );
}
