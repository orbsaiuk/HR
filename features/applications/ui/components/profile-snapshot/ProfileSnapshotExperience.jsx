"use client";

import { Briefcase } from "lucide-react";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export function ProfileSnapshotExperience({ workExperience }) {
    if (!workExperience || workExperience.length === 0) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
                <Briefcase size={14} />
                Work Experience
            </h4>
            <div className="space-y-3">
                {workExperience.map((exp, i) => (
                    <div key={i} className="border-l-2 border-gray-200 pl-3">
                        <p className="font-medium text-sm text-foreground">{exp.title}</p>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        {exp.startDate && (
                            <p className="text-xs text-muted-foreground">
                                {formatDate(exp.startDate)} –{" "}
                                {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                            </p>
                        )}
                        {exp.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {exp.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
