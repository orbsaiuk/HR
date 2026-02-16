"use client";

import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";
import { OrgProfilePage } from "@/features/organization-requests";
import { UserProfilePage } from "@/features/user-profile";
import { Loading } from "@/shared/components/feedback/Loading";

export default function Page() {
    const { requests, loading } = useOrgRequest();

    if (loading) return <Loading fullPage />;

    const hasOrgRequest = requests.some(
        (r) => r.status === "pending" || r.status === "approved"
    );

    if (hasOrgRequest) {
        return <OrgProfilePage />;
    }

    return <UserProfilePage />;
}
