"use client";

import { FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function MyApplicationAnswersSection({ answers, form }) {
  // Build field lookup from form
  const fieldMap = {};
  if (form?.fields) {
    form.fields.forEach((f) => {
      fieldMap[f._key || f.fieldId] = f;
    });
  }

  const normalizeAnswers = () => {
    if (Array.isArray(answers)) return answers;
    if (answers && typeof answers === "object") {
      if (form?.fields?.length) {
        return form.fields
          .filter((f) =>
            Object.prototype.hasOwnProperty.call(answers, f._key || f.fieldId),
          )
          .map((f) => ({
            fieldId: f._key || f.fieldId,
            fieldLabel: f.label,
            fieldType: f.type,
            value: answers[f._key || f.fieldId],
          }));
      }

      return Object.entries(answers).map(([key, value]) => ({
        fieldId: key,
        value,
      }));
    }

    return [];
  };

  const answersArray = normalizeAnswers();

  if (answersArray.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText size={18} />
            Your Submitted Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No answers were recorded for this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText size={18} />
          Your Submitted Answers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {answersArray.map((answer, index) => {
            const field = fieldMap[answer.fieldId];
            const isLast = index === answersArray.length - 1;
            return (
              <div key={answer.fieldId || index}>
                <dt className="text-sm font-medium text-foreground mb-1">
                  {answer.fieldLabel || field?.label || `Question ${index + 1}`}
                </dt>
                <dd className="text-sm text-muted-foreground">
                  {answer.fieldType === "file" ? (
                    <span className="text-blue-600 underline">
                      File uploaded
                    </span>
                  ) : Array.isArray(answer.value) ? (
                    answer.value.join(", ")
                  ) : typeof answer.value === "object" &&
                    answer.value !== null ? (
                    JSON.stringify(answer.value)
                  ) : (
                    answer.value || (
                      <span className="text-muted-foreground/60 italic">
                        No answer
                      </span>
                    )
                  )}
                </dd>
                {!isLast && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
