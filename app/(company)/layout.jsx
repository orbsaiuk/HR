import { DashboardShell } from "@/shared/components/layout/DashboardShell.jsx";
import { ProtectedRoute } from "@/features/shared/auth/components/ProtectedRoute.jsx";
import { RoleGuard } from "@/features/shared/auth/components/RoleGuard.jsx";
import { SyncUser } from "@/features/shared/auth/components/SyncUser.jsx";
import { PermissionsProvider } from "@/shared/providers/PermissionsProvider";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <RoleGuard allowedRoles={["teamMember"]}>
          <PermissionsProvider>
            <DashboardShell>{children}</DashboardShell>
          </PermissionsProvider>
        </RoleGuard>
      </SyncUser>
    </ProtectedRoute>
  );
}
