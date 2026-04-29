"use client";

import { SurveyCard } from "./SurveyCard";

export function SurveysGrid({ surveys, onDelete, onEdit, onResponses }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {surveys.map((survey) => (
        <SurveyCard
          key={survey._id}
          survey={survey}
          onDelete={onDelete}
          onEdit={onEdit}
          onResponses={onResponses}
        />
      ))}
    </div>
  );
}
