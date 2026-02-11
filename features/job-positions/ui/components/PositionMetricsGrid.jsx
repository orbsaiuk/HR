"use client";

import Link from "next/link";
import { Calendar, DollarSign, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function PositionMetricsGrid({ position, positionId }) {
  const formatSalary = () => {
    const { salaryMin, salaryMax, currency } = position;
    if (!salaryMin && !salaryMax) return null;
    const fmt = (n) => n?.toLocaleString();
    if (salaryMin && salaryMax)
      return `${currency || "USD"} ${fmt(salaryMin)} - ${fmt(salaryMax)}`;
    if (salaryMin) return `${currency || "USD"} ${fmt(salaryMin)}+`;
    return `Up to ${currency || "USD"} ${fmt(salaryMax)}`;
  };

  const salary = formatSalary();
  const deadlinePassed =
    position.deadline && new Date(position.deadline) < new Date();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Link href={`/dashboard/positions/${positionId}/applications`}>
        <Card className="hover:border-blue-300 transition-colors h-full">
          <CardContent className="p-4 text-center">
            <Users size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-900">
              {position.applicationCount || 0}
            </p>
            <p className="text-xs text-muted-foreground">Applications</p>
          </CardContent>
        </Card>
      </Link>
      {salary && (
        <Card>
          <CardContent className="p-4 text-center">
            <DollarSign size={20} className="text-green-500 mx-auto mb-1" />
            <p className="text-sm font-bold text-gray-900">{salary}</p>
            <p className="text-xs text-muted-foreground">Salary Range</p>
          </CardContent>
        </Card>
      )}
      {position.deadline && (
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar
              size={20}
              className={`mx-auto mb-1 ${deadlinePassed ? "text-destructive" : "text-orange-500"}`}
            />
            <p
              className={`text-sm font-bold ${deadlinePassed ? "text-destructive" : "text-gray-900"}`}
            >
              {new Date(position.deadline).toLocaleDateString()}
            </p>
            <p className="text-xs text-muted-foreground">
              {deadlinePassed ? "Deadline Passed" : "Deadline"}
            </p>
          </CardContent>
        </Card>
      )}
      {position.form && (
        <Link href={`/dashboard/forms/${position.form._id}`}>
          <Card className="hover:border-blue-300 transition-colors h-full">
            <CardContent className="p-4 text-center">
              <FileText size={20} className="text-purple-500 mx-auto mb-1" />
              <p className="text-sm font-bold text-gray-900 truncate">
                {position.form.title}
              </p>
              <p className="text-xs text-muted-foreground">Application Form</p>
            </CardContent>
          </Card>
        </Link>
      )}
    </div>
  );
}
