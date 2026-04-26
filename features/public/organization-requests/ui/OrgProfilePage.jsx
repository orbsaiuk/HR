"use client";

import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { useOrgRequest } from "../model/useOrgRequest";
import { RequestStatusBadge } from "./components/request-status/RequestStatusBadge";
import { OrgStatusBanner } from "./components/org-profile/OrgStatusBanner";
import { OrgProfileHeader } from "./components/org-profile/OrgProfileHeader";
import { OrgContactCard } from "./components/org-profile/OrgContactCard";
import { OrgDetailsCard } from "./components/org-profile/OrgDetailsCard";
import { OrgRequestTimeline } from "./components/org-profile/OrgRequestTimeline";

/**
 * Organization profile page that displays all org details
 * submitted in the registration request.
 */
export function OrgProfilePage() {
    const { requests, loading, error, refetch } = useOrgRequest();

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} onRetry={refetch} />;

    // Get the most recent active request (pending or approved)
    const request = requests.find(
        (r) => r.status === "pending" || r.status === "approved"
    );

    if (!request) return <Error message="No organization request found" />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Organization Profile
                </h1>
                <RequestStatusBadge status={request.status} />
            </div>

            {/* Status Banner */}
            <OrgStatusBanner request={request} />

            {/* Organization Header Card */}
            <OrgProfileHeader request={request} />

            {/* Contact & Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OrgContactCard request={request} />
                <OrgDetailsCard request={request} />
            </div>

            {/* Request Timeline */}
            <OrgRequestTimeline request={request} />

            {/* Request ID */}
            <p className="text-xs text-gray-400 text-center pb-4">
                Request ID: {request._id}
            </p>
        </div>
    );
}
