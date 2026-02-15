"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ApplicationAnswersCard({ answers }) {
  const answersArray = Array.isArray(answers)
    ? answers
    : answers && typeof answers === "object"
      ? Object.entries(answers).map(([key, value]) => ({
          fieldId: key,
          value,
        }))
      : [];

  if (answersArray.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-4 text-center">
            No form responses submitted with this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Application Responses
          <Badge variant="secondary" className="ml-2">
            {answersArray.length} answer(s)
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {answersArray.map((answer, idx) => (
            <div key={answer.fieldId || idx} className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {answer.fieldLabel || `Question ${idx + 1}`}
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {Array.isArray(answer.value)
                  ? answer.value.join(", ")
                  : typeof answer.value === "object" && answer.value !== null
                    ? JSON.stringify(answer.value)
                    : answer.value || (
                        <span className="text-muted-foreground italic">
                          No answer
                        </span>
                      )}
              </p>
              {answer.fieldType && (
                <Badge variant="outline" className="mt-2 text-xs">
                  {answer.fieldType}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
