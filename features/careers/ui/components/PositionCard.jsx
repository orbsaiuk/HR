"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

/** Strip HTML tags for plain-text preview */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";

const TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

function formatSalary(min, max, currency = "USD") {
  const fmt = (v) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(v);

  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  if (max) return `Up to ${fmt(max)}`;
  return null;
}

export function PositionCard({ position }) {
  const salary = formatSalary(
    position.salaryMin,
    position.salaryMax,
    position.currency,
  );

  const deadlineDate = position.deadline ? new Date(position.deadline) : null;
  const isExpiringSoon =
    deadlineDate &&
    deadlineDate - new Date() < 7 * 24 * 60 * 60 * 1000 &&
    deadlineDate > new Date();

  const isClosed = position.status === "closed";

  const cardContent = (
    <Card
      className={`h-full transition-all ${!isClosed ? "hover:shadow-lg hover:border-blue-300" : "opacity-75"}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle
            className={`text-lg ${!isClosed ? "group-hover:text-blue-600" : ""} transition-colors`}
          >
            {position.title}
          </CardTitle>
          <div className="flex gap-2 items-start ml-2">
            {isClosed && (
              <Badge variant="destructive" className="whitespace-nowrap">
                <AlertCircle size={12} className="mr-1" />
                Closed
              </Badge>
            )}
            {isExpiringSoon && !isClosed && (
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-700 border-amber-200 whitespace-nowrap"
              >
                Closing soon
              </Badge>
            )}
          </div>
        </div>
        {position.department && (
          <CardDescription className="flex items-center gap-1.5">
            <Building2 size={14} />
            {position.department}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {position.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {stripHtml(position.description)}
          </p>
        )}

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {position.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {position.location}
            </span>
          )}
          {position.type && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {TYPE_LABELS[position.type] || position.type}
            </span>
          )}
          {salary && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              {salary}
            </span>
          )}
          {position.applicationCount > 0 && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              {position.applicationCount} applicant
              {position.applicationCount !== 1 && "s"}
            </span>
          )}
          {deadlineDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {deadlineDate.toLocaleDateString()}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isClosed) {
    return <div className="block">{cardContent}</div>;
  }

  return (
    <Link href={`/careers/${position._id}`} className="block group">
      {cardContent}
    </Link>
  );
}
