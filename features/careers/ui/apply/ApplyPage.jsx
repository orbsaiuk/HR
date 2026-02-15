"use client";

import { useEffect } from "react";
import { useCareerDetail } from "../../model/useCareerDetail";
import { useCareerApplication } from "../../model/useCareerApplication";
import { useUserProfile } from "@/features/user-profile/model/useUserProfile";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApplySignInRequired } from "./ApplySignInRequired";
import { ApplyFormUnavailable } from "./ApplyFormUnavailable";
import { ApplyAlreadyApplied } from "./ApplyAlreadyApplied";
import { ApplySubmitted } from "./ApplySubmitted";
import { ApplyWithProfileSection } from "./ApplyWithProfileSection";
import { ApplyWithFormSection } from "./ApplyWithFormSection";
import { ApplyWithBothSection } from "./ApplyWithBothSection";
import { ProfileIncompleteWarning } from "./ProfileIncompleteWarning";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export function ApplyPage({ positionId }) {
    const { isSignedIn, isLoaded } = useAuth();
    const { position, loading, error } = useCareerDetail(positionId);
    const {
        submitting,
        submitted,
        alreadyApplied,
        checkingApplied,
        error: submitError,
        submitApplication,
        submitProfileApplication,
        checkAlreadyApplied,
        goToCareers,
    } = useCareerApplication(positionId);

    const applicationMethod = position?.applicationMethod || "form";
    const needsProfile =
        applicationMethod === "profile" || applicationMethod === "both";

    const { profile, loading: profileLoading } = useUserProfile();

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;
        fetch("/api/auth/sync", { method: "POST" }).catch(() => { });
    }, [isLoaded, isSignedIn]);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            checkAlreadyApplied();
        }
    }, [isLoaded, isSignedIn, checkAlreadyApplied]);

    // Loading states
    if (loading || (needsProfile && profileLoading)) return <Loading fullPage />;
    if (error) return <Error message={error} />;
    if (!position) return <Error message="Position not found" />;

    // Gate: authentication
    if (isLoaded && !isSignedIn) {
        return <ApplySignInRequired positionId={positionId} />;
    }

    // Gate: form availability
    if (
        (applicationMethod === "form" || applicationMethod === "both") &&
        !position.form
    ) {
        return <ApplyFormUnavailable positionId={positionId} />;
    }

    if (checkingApplied) return <Loading fullPage />;

    // Gate: duplicate application
    if (alreadyApplied) {
        return <ApplyAlreadyApplied onBrowse={goToCareers} />;
    }

    // Gate: success
    if (submitted) {
        return (
            <ApplySubmitted
                positionTitle={position.title}
                onBrowse={goToCareers}
            />
        );
    }

    // Gate: profile completeness
    if (needsProfile) {
        const isProfileComplete =
            profile &&
            profile.name &&
            (profile.headline ||
                profile.bio ||
                (profile.skills && profile.skills.length > 0));

        if (!isProfileComplete) {
            return (
                <div className="min-h-screen bg-gray-50">
                    <div className="container mx-auto px-4 py-8 max-w-3xl">
                        <Button variant="link" asChild className="px-0 mb-6">
                            <Link href={`/careers/${positionId}`}>
                                <ArrowLeft size={16} />
                                Back to {position.title}
                            </Link>
                        </Button>
                        <ProfileIncompleteWarning positionId={positionId} />
                    </div>
                </div>
            );
        }
    }

    function handleFormSubmit(answers) {
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

                {applicationMethod === "profile" && (
                    <ApplyWithProfileSection
                        profile={profile}
                        onSubmit={submitProfileApplication}
                        submitting={submitting}
                    />
                )}

                {applicationMethod === "form" && (
                    <ApplyWithFormSection
                        form={position.form}
                        onSubmit={handleFormSubmit}
                        submitting={submitting}
                    />
                )}

                {applicationMethod === "both" && (
                    <ApplyWithBothSection
                        profile={profile}
                        form={position.form}
                        onSubmit={handleFormSubmit}
                        submitting={submitting}
                    />
                )}
            </div>
        </div>
    );
}
