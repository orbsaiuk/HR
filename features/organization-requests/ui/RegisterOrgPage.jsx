"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                    <Building2 size={48} className="mx-auto text-blue-500 mb-4" />
                    <h2 className="text-xl font-semibold text-blue-800 mb-2">
                        Sign In Required
                    </h2>
                    <p className="text-sm text-blue-700 mb-6">
                        You need to sign in or create an account before registering
                        your organization.
                    </p>
                    <SignInButton mode="modal" afterSignInUrl="/register-organization">
                        <Button size="lg">Sign In to Continue</Button>
                    </SignInButton>
                </div>
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
        const bgColor = isPending ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200";
        const textColor = isPending ? "text-yellow-800" : "text-green-800";
        const subTextColor = isPending ? "text-yellow-700" : "text-green-700";
        const iconColor = isPending ? "text-yellow-500" : "text-green-500";

        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <div className={`${bgColor} border rounded-lg p-8`}>
                    <StatusIcon size={48} className={`mx-auto ${iconColor} mb-4`} />
                    <h2 className={`text-xl font-semibold ${textColor} mb-2`}>
                        {isPending
                            ? "Request Already Submitted"
                            : "Organization Already Registered"}
                    </h2>
                    <p className={`text-sm ${subTextColor} mb-2`}>
                        {isPending
                            ? `Your organization "${existingRequest.orgName}" registration request is pending review by an administrator.`
                            : `Your organization "${existingRequest.orgName}" has been approved.`}
                    </p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/user/organization-requests">
                            View Request Status
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                    <Building2 size={48} className="mx-auto text-green-500 mb-4" />
                    <h2 className="text-xl font-semibold text-green-800 mb-2">
                        Request Submitted Successfully!
                    </h2>
                    <p className="text-sm text-green-700">
                        Your organization registration request has been submitted.
                        A platform administrator will review it shortly. Redirecting...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Register Your Organization
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Submit a request to register your organization on the platform.
                    Once approved, you&apos;ll be able to manage your team, post job
                    positions, and more.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            <OrgRegistrationForm
                onSubmit={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
}
