"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Plus } from "lucide-react";
import { useOrganizationList } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { useOrgRequest } from "../model/useOrgRequest";
import { RequestsList } from "./components/request-status/RequestsList";
import { RequestStatusCard } from "./components/request-status/RequestStatusCard";

/**
 * Orchestrator page for viewing organization request status.
 * Shows the list of user's requests with their statuses.
 * Auto-redirects to dashboard when the latest request is approved.
 */
export function OrgRequestStatusPage() {
    const { requests, loading, error, refetch } = useOrgRequest();
    const router = useRouter();
    const { userMemberships, setActive, isLoaded: isOrgListLoaded } = useOrganizationList({
        userMemberships: { infinite: true },
    });

    const hasApproved = !loading && requests.length > 0 && requests[0]?.status === "approved";

    // Auto-redirect to dashboard when the latest request is approved
    useEffect(() => {
        if (!hasApproved || !isOrgListLoaded) return;

        async function activateAndRedirect() {
            try {
                const membership = userMemberships?.data?.[0];
                if (membership && setActive) {
                    await setActive({ organization: membership.organization.id });
                }
                window.location.href = "/dashboard";
            } catch (err) {
                console.error("Failed to activate organization:", err);
                window.location.href = "/dashboard";
            }
        }

        activateAndRedirect();
    }, [hasApproved, isOrgListLoaded, userMemberships, setActive]);

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} onRetry={refetch} />;

    const hasPending = requests.some((r) => r.status === "pending");

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Organization Requests
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Track the status of your organization registration requests.
                    </p>
                </div>
                {!hasPending && (
                    <Link href="/register-organization">
                        <Button size="sm">
                            <Plus size={16} className="mr-2" />
                            New Request
                        </Button>
                    </Link>
                )}
            </div>

            {/* Show the most recent request as a detailed card */}
            {requests.length > 0 && (
                <div className="mb-8">
                    <RequestStatusCard request={requests[0]} />
                </div>
            )}

            {/* Show remaining requests as a list */}
            {requests.length > 1 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Previous Requests
                    </h2>
                    <RequestsList requests={requests.slice(1)} />
                </div>
            )}

            {requests.length === 0 && (
                <div className="text-center py-12">
                    <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No requests yet
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Register your organization to start using the platform.
                    </p>
                    <Link href="/register-organization">
                        <Button>
                            <Plus size={16} className="mr-2" />
                            Register Organization
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
