"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Header } from "@/shared/components/layout/Header";
import { AccountTypeSelector } from "./AccountTypeSelector";
import { useOrgRequest } from "@/features/organization-requests/model/useOrgRequest";

/**
 * Guard that shows the AccountTypeSelector if the signed-in user
 * hasn't chosen an account type yet.
 *
 * Team members (role === "teamMember") skip this entirely — their
 * experience is defined by their organization role, not account type.
 *
 * Users who have submitted an organization request (pending or approved)
 * also skip the selector, as their role will be determined by the org approval process.
 */
export function AccountTypeGuard({ children }) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  // Fetch org requests to check if user has already submitted
  const { requests, loading: orgRequestLoading } = useOrgRequest(Boolean(isLoaded && user));

  const ORG_FLOW_PATHS = ["/register-organization", "/user/organization-requests"];
  const isOrgFlowPath = ORG_FLOW_PATHS.some((path) => pathname.startsWith(path));

  // Wait for user and org request data before making decision
  if (!isLoaded || !user || orgRequestLoading) {
    return <>{children}</>;
  }

  const role = user.publicMetadata?.role;
  const accountType = user.publicMetadata?.accountType;
  const hasOrgRequest = requests.some((r) => r.status === "pending" || r.status === "approved");

  // Team members don't need an account type
  if (role === "teamMember") {
    return <>{children}</>;
  }

  // Skip selector if user has submitted an org request (they will become org owner after approval)
  if (!accountType && !isOrgFlowPath && !hasOrgRequest) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AccountTypeSelector />
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
