"use client";

import { Briefcase } from "lucide-react";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export function ProfilePreviewExperience({ workExperience }) {
    if (!workExperience || workExperience.length === 0) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <Briefcase size={14} />
                Work Experience
            </h4>
            <div className="space-y-2">
                {workExperience.slice(0, 3).map((exp, i) => (
                    <div key={exp._key || i} className="text-sm">
                        <p className="font-medium text-foreground">{exp.title}</p>
                        <p className="text-muted-foreground">
                            {exp.company}
                            {exp.startDate && (
                                <span className="ml-1">
                                    · {formatDate(exp.startDate)} –{" "}
                                    {exp.isCurrent ? "Present" : formatDate(exp.endDate)}
                                </span>
                            )}
                        </p>
                    </div>
                ))}
                {workExperience.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                        +{workExperience.length - 3} more
                    </p>
                )}
            </div>
        </div>
    );
}
