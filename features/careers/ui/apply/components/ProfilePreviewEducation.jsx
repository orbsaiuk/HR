"use client";

import { GraduationCap } from "lucide-react";

function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
    });
}

export function ProfilePreviewEducation({ education }) {
    if (!education || education.length === 0) return null;

    return (
        <div>
            <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-2">
                <GraduationCap size={14} />
                Education
            </h4>
            <div className="space-y-2">
                {education.slice(0, 3).map((edu, i) => (
                    <div key={edu._key || i} className="text-sm">
                        <p className="font-medium text-foreground">
                            {edu.degree}
                            {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                        </p>
                        <p className="text-muted-foreground">
                            {edu.institution}
                            {edu.startDate && (
                                <span className="ml-1">
                                    · {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                                </span>
                            )}
                        </p>
                    </div>
                ))}
                {education.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                        +{education.length - 3} more
                    </p>
                )}
            </div>
        </div>
    );
}
