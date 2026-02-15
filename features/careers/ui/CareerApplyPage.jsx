"use client";

import { useEffect } from "react";
import { useCareerDetail } from "../model/useCareerDetail";
import { useCareerApplication } from "../model/useCareerApplication";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FormViewer } from "@/features/forms/components/FormViewer/FormViewer.jsx";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, CheckCircle, AlertCircle, Info, Lock } from "lucide-react";

export function CareerApplyPage({ positionId }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { position, loading, error } = useCareerDetail(positionId);
  const {
    submitting,
    submitted,
    alreadyApplied,
    checkingApplied,
    error: submitError,
    submitApplication,
    checkAlreadyApplied,
    goToCareers,
  } = useCareerApplication(positionId);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/auth/sync", { method: "POST" }).catch(() => {});
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      checkAlreadyApplied();
    }
  }, [isLoaded, isSignedIn, checkAlreadyApplied]);

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} />;
  if (!position) return <Error message="Position not found" />;

  // Require authentication to apply
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Lock className="mx-auto text-blue-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Sign In Required
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to sign in or create an account to apply for this position.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/sign-up">Create Account</Link>
            </Button>
          </div>
          <Button variant="link" asChild className="mt-4">
            <Link href={`/careers/${positionId}`}>
              <ArrowLeft size={16} />
              Back to Position
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!position.form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Application Form Unavailable
          </h2>
          <p className="text-muted-foreground mb-4">
            The application form for this position is not yet available.
          </p>
          <Button asChild>
            <Link href={`/careers/${positionId}`}>Back to Position</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (checkingApplied) return <Loading fullPage />;

  if (alreadyApplied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Info className="mx-auto text-blue-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Already Applied
          </h2>
          <p className="text-muted-foreground mb-4">
            You have already submitted an application for this position.
          </p>
          <Button onClick={goToCareers}>Browse Other Positions</Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-foreground mb-2">
            Application Submitted!
          </h2>
          <p className="text-muted-foreground mb-6">
            Your application for <strong>{position.title}</strong> has been
            received. You can track its status from your applications page.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <Link href="/my-applications">View My Applications</Link>
            </Button>
            <Button variant="outline" onClick={goToCareers}>
              Browse More Positions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(answers) {
    submitApplication(answers, position.form._id);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="link" asChild className="px-0 mb-6">
          <Link href={`/careers/${positionId}`}>
            <ArrowLeft size={16} />
            Back to {position.title}
          </Link>
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Apply for {position.title}
            </CardTitle>
            {position.department && (
              <CardDescription>{position.department}</CardDescription>
            )}
          </CardHeader>
        </Card>

        {submitError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-6 flex items-center gap-2">
            <AlertCircle size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{submitError}</p>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <FormViewer
              form={position.form}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
