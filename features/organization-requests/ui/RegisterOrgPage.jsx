"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useOrgRequest } from "../model/useOrgRequest";
import { OrgRegistrationForm } from "./components/registration-form/OrgRegistrationForm";

/**
 * Orchestrator page for organization registration.
 * Thin wrapper — delegates form rendering to OrgRegistrationForm.
 */
export function RegisterOrgPage() {
    const router = useRouter();
    const { submitRequest, submitting, error } = useOrgRequest();
    const [success, setSuccess] = useState(false);

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
