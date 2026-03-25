"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { useOrganizationList } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { useOrgRequest } from "../model/useOrgRequest";
import { RequestStatusCard } from "./components/request-status/RequestStatusCard";

/**
 * Orchestrator page for viewing organization request status.
 * Shows the list of user's requests with their statuses.
 * Auto-redirects to dashboard when the latest request is approved.
 */
export function OrgRequestStatusPage() {
  const { requests, loading, error, refetch } = useOrgRequest();
  const {
    userMemberships,
    setActive,
    isLoaded: isOrgListLoaded,
  } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const hasApproved =
    !loading && requests.length > 0 && requests[0]?.status === "approved";

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

  const latestRequest = requests[0] || null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            طلب تسجيل المؤسسة
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            تابع حالة طلب تسجيل مؤسستك من مكان واحد.
          </p>
        </div>
        {!latestRequest && (
          <Link href="/register-organization">
            <Button size="sm">
              <Plus size={16} className="ml-2" />
              تقديم الطلب
            </Button>
          </Link>
        )}
      </div>

      {/* Show the single/latest request */}
      {latestRequest && (
        <div className="mb-8">
          <RequestStatusCard request={latestRequest} />
        </div>
      )}

      {requests.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            لا يوجد طلب حتى الآن
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            ابدأ الآن بإرسال طلب تسجيل مؤسستك للانضمام إلى المنصة.
          </p>
          <Link href="/register-organization">
            <Button>
              <Plus size={16} className="ml-2" />
              تسجيل مؤسسة
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
