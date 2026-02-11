"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  MapPin,
  Briefcase,
  Calendar,
  User,
  Mail,
  Save,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useApplicationDetail } from "../model/useApplicationDetail";
import { useApplicationActions } from "../model/useApplicationActions";
import { ApplicationStatusBadge } from "./ApplicationStatusBadge";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const STATUS_OPTIONS = [
  "new",
  "screening",
  "interview",
  "offered",
  "hired",
  "rejected",
];

export function ApplicationDetailPage({ applicationId, positionId }) {
  const router = useRouter();
  const { application, loading, error, refetch, setApplication } =
    useApplicationDetail(applicationId);
  const { updateStatus, updateApplication, deleteApplication, actionLoading } =
    useApplicationActions();
  const { toast, showToast, hideToast } = useToast();

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (application) {
      setNotes(application.notes || "");
      setRating(application.rating || 0);
      setRejectionReason(application.rejectionReason || "");
    }
  }, [application]);

  const handleStatusChange = async (newStatus) => {
    const extra = {};
    if (newStatus === "rejected") extra.rejectionReason = rejectionReason;
    extra.notes = notes;
    extra.rating = rating;

    const result = await updateStatus(applicationId, newStatus, extra);
    if (result.success) {
      setApplication({
        ...application,
        status: newStatus,
        notes,
        rating,
        rejectionReason,
      });
      showToast(`Status changed to ${newStatus}`, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleSaveNotes = async () => {
    const result = await updateApplication(applicationId, {
      notes,
      rating,
      rejectionReason,
    });
    if (result.success) {
      showToast("Notes saved", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    const result = await deleteApplication(applicationId);
    if (result.success) {
      showToast("Application deleted", "success");
      router.push(`/dashboard/positions/${positionId}`);
    } else {
      showToast(result.error, "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!application) return <Error message="Application not found" />;

  const { applicant, jobPosition, form, answers, status, appliedAt } =
    application;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/positions/${positionId}/applications`}>
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {applicant?.name || "Unknown Applicant"}
            </h1>
            <p className="text-muted-foreground">
              Applied to {jobPosition?.title || "—"}
              {appliedAt && (
                <>
                  {" "}
                  ·{" "}
                  {formatDistanceToNow(new Date(appliedAt), {
                    addSuffix: true,
                  })}
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ApplicationStatusBadge status={status} />
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content — Left 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <Card>
            <CardHeader>
              <CardTitle>Applicant Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{applicant?.name || "Unknown"}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail size={12} />
                    {applicant?.email || "No email"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Answers */}
          <Card>
            <CardHeader>
              <CardTitle>
                Application Responses
                {answers?.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {answers.length} answer(s)
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!answers || answers.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No form responses submitted with this application.
                </p>
              ) : (
                <div className="space-y-4">
                  {answers.map((answer, idx) => (
                    <div
                      key={answer.fieldId || idx}
                      className="border rounded-lg p-4"
                    >
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        {answer.fieldLabel || `Question ${idx + 1}`}
                      </p>
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {answer.value || (
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — Right col */}
        <div className="space-y-6">
          {/* Position Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Position</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{jobPosition?.title || "—"}</p>
              {jobPosition?.department && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase size={14} />
                  {jobPosition.department}
                </div>
              )}
              {jobPosition?.location && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin size={14} />
                  {jobPosition.location}
                </div>
              )}
              {jobPosition?.type && (
                <Badge variant="outline" className="capitalize">
                  {jobPosition.type}
                </Badge>
              )}
              {jobPosition && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  asChild
                >
                  <Link href={`/dashboard/positions/${jobPosition._id}`}>
                    View Position
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={status === s ? "default" : "outline"}
                    disabled={actionLoading}
                    onClick={() => handleStatusChange(s)}
                    className="capitalize text-xs"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rating */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 hover:text-yellow-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recruiter Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Add internal notes about this candidate..."
              />

              {(status === "rejected" || rejectionReason) && (
                <div className="space-y-1">
                  <Label className="text-xs">Rejection Reason</Label>
                  <Textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    placeholder="Reason for rejection (optional)..."
                  />
                </div>
              )}

              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={actionLoading}
                onClick={handleSaveNotes}
              >
                <Save size={14} className="mr-1" />
                {actionLoading ? "Saving..." : "Save Notes"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
