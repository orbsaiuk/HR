"use client";

import Link from "next/link";
import { useProfileCompletion } from "../model/useProfileCompletion";
import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";
import { AlertCircle } from "lucide-react";

/**
 * Banner that shows profile completion percentage and prompts
 * the user to fill missing sections. Intended for the user layout.
 * Hidden when profile is complete or user has an org request.
 */
export function ProfileCompletionBanner() {
    const { percentage, missingSections, isComplete, loading } = useProfileCompletion();
    const { requests, loading: orgLoading } = useOrgRequest();

    const hasOrgRequest = requests.some(
        (r) => r.status === "pending" || r.status === "approved"
    );

    if (loading || orgLoading || isComplete || hasOrgRequest) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mb-6">
            <AlertCircle size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <p className="text-sm font-medium text-blue-900">
                        Profile {percentage}% complete
                    </p>
                    <div className="flex-1 max-w-[200px] bg-blue-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                {missingSections.length > 0 && (
                    <p className="text-xs text-blue-700">
                        Missing: {missingSections.join(", ")}
                    </p>
                )}
                <Link
                    href="/user/profile/edit"
                    className="text-sm text-blue-700 font-medium hover:underline mt-1 inline-block"
                >
                    Complete your profile →
                </Link>
            </div>
        </div>
    );
}
