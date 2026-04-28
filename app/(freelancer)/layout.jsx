"use client";

import { DashboardShell } from "@/shared/components/layout/DashboardShell.jsx";
import { ProtectedRoute } from "@/features/shared/auth/components/ProtectedRoute.jsx";
import { AccountTypeGuard } from "@/features/shared/auth/components/AccountTypeGuard.jsx";
import { SyncUser } from "@/features/shared/auth/components/SyncUser.jsx";
import { FreelancerProfileProvider } from "@/features/freelancer/profile/providers/FreelancerProfileContext.jsx";
import { ProfileCompletionBannerWrapper } from "@/features/freelancer/profile/components/ProfileCompletionBannerWrapper.jsx";

export default function FreelancerLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <AccountTypeGuard allowedTypes={["freelancer"]}>
          <FreelancerProfileProvider>
            <DashboardShell variant="freelancer">
              <ProfileCompletionBannerWrapper />
              {children}
            </DashboardShell>
          </FreelancerProfileProvider>
        </AccountTypeGuard>
      </SyncUser>
    </ProtectedRoute>
  );
}
