"use client";

import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileSnapshotResume({ resumeUrl }) {
    if (!resumeUrl) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <FileText size={14} />
                Resume
            </h4>
            <Button variant="outline" size="sm" asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                    <Download size={14} className="mr-1" />
                    Download Resume
                </a>
            </Button>
        </div>
    );
}
