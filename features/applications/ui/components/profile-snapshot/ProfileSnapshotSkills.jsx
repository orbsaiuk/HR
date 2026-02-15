"use client";

import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProfileSnapshotSkills({ skills }) {
    if (!skills || skills.length === 0) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <Tag size={14} />
                Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
