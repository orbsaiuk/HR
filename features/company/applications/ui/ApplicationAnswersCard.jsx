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
          <CardTitle>إجابات نموذج التقديم</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm py-4 text-center">
            لم يتم إرسال أي إجابات مع طلب التقديم هذا.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          إجابات نموذج التقديم
          <Badge variant="secondary" className="mr-2">
            {answersArray.length} إجابة
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {answersArray.map((answer, idx) => (
            <div key={answer.fieldId || idx} className="border rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                {answer.fieldLabel || `السؤال ${idx + 1}`}
              </p>
              <p className="text-gray-900 whitespace-pre-wrap">
                {Array.isArray(answer.value)
                  ? answer.value.join("، ")
                  : typeof answer.value === "object" && answer.value !== null
                    ? JSON.stringify(answer.value)
                    : answer.value || (
                        <span className="text-muted-foreground italic">
                          لا توجد إجابة
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
