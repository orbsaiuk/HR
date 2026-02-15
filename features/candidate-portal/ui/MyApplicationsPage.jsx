"use client";

import Link from "next/link";
import { useMyApplications } from "../model/useMyApplications";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { StatusBadge } from "@/features/careers/ui/components/StatusTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
  Search,
} from "lucide-react";

const TYPE_LABELS = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
  remote: "Remote",
};

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "new", label: "Submitted" },
  { value: "screening", label: "Under Review" },
  { value: "interview", label: "Interview" },
  { value: "offered", label: "Offer" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Not Selected" },
];

export function MyApplicationsPage() {
  const { applications, stats, loading, error, statusFilter, setStatusFilter } =
    useMyApplications();

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} />;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and manage your job applications
          </p>
        </div>
        <Button asChild>
          <Link href="/careers">
            <Search size={16} />
            Browse Open Positions
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {STATUS_OPTIONS.filter((s) => s.value !== "").map((opt) => (
            <Button
              key={opt.value}
              variant={statusFilter === opt.value ? "default" : "outline"}
              className="h-auto flex-col py-2"
              onClick={() =>
                setStatusFilter(statusFilter === opt.value ? "" : opt.value)
              }
            >
              <div className="text-lg font-bold">{stats[opt.value] || 0}</div>
              <div className="text-xs font-normal">{opt.label}</div>
            </Button>
          ))}
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={
            statusFilter
              ? "No applications with this status"
              : "No applications yet"
          }
          description={
            statusFilter
              ? "Try selecting a different status filter."
              : "Start exploring open positions and submit your first application."
          }
          action={
            statusFilter
              ? { label: "Clear Filter", onClick: () => setStatusFilter("") }
              : { label: "Browse Positions", href: "/careers" }
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Link
              key={app._id}
              href={`/my-applications/${app._id}`}
              className="block group"
            >
              <Card className="hover:shadow-md hover:border-blue-200 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors truncate">
                          {app.jobPosition?.title || "Untitled Position"}
                        </h3>
                        <StatusBadge status={app.status} />
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {app.jobPosition?.department && (
                          <span className="flex items-center gap-1">
                            <Building2 size={14} />
                            {app.jobPosition.department}
                          </span>
                        )}
                        {app.jobPosition?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {app.jobPosition.location}
                          </span>
                        )}
                        {app.jobPosition?.type && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {TYPE_LABELS[app.jobPosition.type] ||
                              app.jobPosition.type}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Applied{" "}
                        {new Date(app.appliedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <ArrowRight
                      size={20}
                      className="text-muted-foreground/30 group-hover:text-blue-500 transition-colors mt-1 ml-4 shrink-0"
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
