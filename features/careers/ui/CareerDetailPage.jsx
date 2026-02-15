"use client";

import { useCareerDetail } from "../model/useCareerDetail";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MarkdownContent } from "@/components/ui/markdown-content";
import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Calendar,
  Users,
  ExternalLink,
  Lock,
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

export function CareerDetailPage({ positionId }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { position, loading, error } = useCareerDetail(positionId);

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} />;
  if (!position) return <Error message="Position not found" />;

  const salary = formatSalary(
    position.salaryMin,
    position.salaryMax,
    position.currency,
  );

  const deadlineDate = position.deadline ? new Date(position.deadline) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} />
            Back to all positions
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {position.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {position.department && (
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    {position.department}
                  </span>
                )}
                {position.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    {position.location}
                  </span>
                )}
                {position.type && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {TYPE_LABELS[position.type] || position.type}
                  </span>
                )}
                {salary && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign size={14} />
                    {salary}
                  </span>
                )}
              </div>
            </div>

            {isLoaded && !isSignedIn ? (
              <SignInButton
                mode="modal"
                forceRedirectUrl={`/careers/${positionId}/apply`}
              >
                <Button size="lg" variant="outline">
                  <Lock size={16} />
                  Sign In to Apply
                </Button>
              </SignInButton>
            ) : (
              <Button asChild size="lg">
                <Link href={`/careers/${positionId}/apply`}>
                  Apply Now
                  <ExternalLink size={16} />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {position.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About This Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownContent
                    content={position.description}
                    className="text-muted-foreground"
                  />
                </CardContent>
              </Card>
            )}

            {position.requirements && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownContent
                    content={position.requirements}
                    className="text-muted-foreground"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm uppercase tracking-wide">
                  Position Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  {position.department && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Department
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">
                        {position.department}
                      </dd>
                    </div>
                  )}
                  {position.type && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Employment Type
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">
                        {TYPE_LABELS[position.type] || position.type}
                      </dd>
                    </div>
                  )}
                  {position.location && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Location
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">
                        {position.location}
                      </dd>
                    </div>
                  )}
                  {salary && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Salary Range
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">
                        {salary}
                      </dd>
                    </div>
                  )}
                  {deadlineDate && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Application Deadline
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5">
                        {deadlineDate.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </dd>
                    </div>
                  )}
                  {position.applicationCount > 0 && (
                    <div>
                      <dt className="text-xs text-muted-foreground uppercase tracking-wide">
                        Applicants
                      </dt>
                      <dd className="text-sm font-medium text-foreground mt-0.5 flex items-center gap-1">
                        <Users size={14} />
                        {position.applicationCount}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* CTA */}
            {isLoaded && !isSignedIn ? (
              <Button asChild className="w-full" size="lg" variant="outline">
                <Link href="/sign-in">
                  <Lock size={16} />
                  Sign In to Apply
                </Link>
              </Button>
            ) : (
              <Button asChild className="w-full" size="lg">
                <Link href={`/careers/${positionId}/apply`}>
                  Apply for This Position
                </Link>
              </Button>
            )}

            <p className="text-xs text-gray-400 text-center">
              Posted{" "}
              {new Date(position.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
