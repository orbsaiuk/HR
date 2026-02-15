"use client";

import { useMyApplicationDetail } from "../model/useMyApplicationDetail";
import { MyApplicationHeader } from "./MyApplicationHeader";
import { MyApplicationAnswersSection } from "./MyApplicationAnswersSection";
import { MyApplicationPositionCard } from "./MyApplicationPositionCard";
import { MyApplicationFeedbackCard } from "./MyApplicationFeedbackCard";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";

export function MyApplicationDetailPage({ applicationId }) {
  const { application, loading, error } = useMyApplicationDetail(applicationId);

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} />;
  if (!application) return <Error message="Application not found" />;

  const position = application.jobPosition;
  const form = application.form;
  const answers = application.answers || [];

  return (
    <div>
      <MyApplicationHeader
        positionTitle={position?.title}
        status={application.status}
        application={application}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <MyApplicationAnswersSection answers={answers} form={form} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <MyApplicationPositionCard position={position} />
          <MyApplicationFeedbackCard
            status={application.status}
            rejectionReason={application.rejectionReason}
          />

          {/* Last Updated */}
          {application.updatedAt && (
            <div className="text-xs text-muted-foreground text-center">
              Last updated{" "}
              {new Date(application.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
