import { DashboardShell } from "@/shared/components/layout/DashboardShell.jsx";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute.jsx";
import { AccountTypeGuard } from "@/features/auth/components/AccountTypeGuard.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";

export default function FreelancerLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <AccountTypeGuard allowedTypes={["freelancer"]}>
          <DashboardShell variant="freelancer">{children}</DashboardShell>
        </AccountTypeGuard>
      </SyncUser>
    </ProtectedRoute>
  );
}
