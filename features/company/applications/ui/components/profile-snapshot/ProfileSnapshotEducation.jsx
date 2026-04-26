"use client";

import { GraduationCap } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    month: "short",
    year: "numeric",
  });
}

export function ProfileSnapshotEducation({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-foreground flex items-center gap-1.5 mb-3">
        <GraduationCap size={14} />
        التعليم
      </h4>
      <div className="space-y-3">
        {education.map((edu, i) => (
          <div key={i} className="border-r-2 border-gray-200 pr-3">
            <p className="font-medium text-sm text-foreground">
              {edu.degree}
              {edu.fieldOfStudy && ` في ${edu.fieldOfStudy}`}
            </p>
            <p className="text-sm text-muted-foreground">{edu.institution}</p>
            {edu.startDate && (
              <p className="text-xs text-muted-foreground">
                {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
