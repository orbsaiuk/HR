"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Clock, CheckCircle2 } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useOrgRequest } from "../model/useOrgRequest";
import { OrgRegistrationForm } from "./components/registration-form/OrgRegistrationForm";

/**
 * Orchestrator page for organization registration.
 * Thin wrapper — delegates form rendering to OrgRegistrationForm.
 */
export function RegisterOrgPage() {
    const router = useRouter();
    const { isSignedIn, isLoaded } = useUser();
    const { requests, loading, submitRequest, submitting, error } = useOrgRequest();
    const [success, setSuccess] = useState(false);

    // Find any existing request (pending or approved)
    const existingRequest = requests.find(
        (r) => r.status === "pending" || r.status === "approved"
    );

    if (!isLoaded || (isSignedIn && loading)) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                        <Building2 size={48} className="text-primary" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Sign In Required
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                You need to sign in or create an account before registering
                                your organization.
                            </p>
                        </div>
                        <SignInButton mode="modal" afterSignInUrl="/register-organization">
                            <Button size="lg">Sign In to Continue</Button>
                        </SignInButton>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleSubmit = async (data) => {
        try {
            await submitRequest(data);
            setSuccess(true);
            // Redirect to status page after short delay
            setTimeout(() => {
                router.push("/user/organization-requests");
            }, 2000);
        } catch {
            // Error is handled by the hook
        }
    };

    // Block registration if user already has a pending or approved request
    if (existingRequest) {
        const isPending = existingRequest.status === "pending";
        const StatusIcon = isPending ? Clock : CheckCircle2;

        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                        <StatusIcon
                            size={48}
                            className={isPending ? "text-yellow-500" : "text-green-500"}
                        />
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                {isPending
                                    ? "Request Already Submitted"
                                    : "Organization Already Registered"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {isPending
                                    ? `Your organization "${existingRequest.orgName}" registration request is pending review by an administrator.`
                                    : `Your organization "${existingRequest.orgName}" has been approved.`}
                            </p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href="/user/organization-requests">
                                View Request Status
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <Card>
                    <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4">
                        <Building2 size={48} className="text-green-500" />
                        <div className="space-y-2">
                            <h2 className="text-xl font-semibold">
                                Request Submitted Successfully!
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Your organization registration request has been submitted.
                                A platform administrator will review it shortly. Redirecting...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">
                    Register Your Organization
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Submit a request to register your organization on the platform.
                    Once approved, you&apos;ll be able to manage your team, post job
                    positions, and more.
                </p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <OrgRegistrationForm
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
}
