import { DashboardHeader } from "@/shared/components/layout/DashboardHeader.jsx";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute.jsx";
import { RoleGuard } from "@/features/auth/components/RoleGuard.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";
import { PermissionsProvider } from "@/shared/providers/PermissionsProvider";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <RoleGuard allowedRoles={["teamMember"]}>
          <PermissionsProvider>
            <div className="min-h-screen bg-gray-50 print:bg-white">
              <div className="print:hidden">
                <DashboardHeader />
              </div>
              <main className="p-4 pb-1 print:p-0">{children}</main>
            </div>
          </PermissionsProvider>
        </RoleGuard>
      </SyncUser>
    </ProtectedRoute>
  );
}
