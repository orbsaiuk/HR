import { Sidebar } from "@/shared/components/layout/Sidebar.jsx";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute.jsx";
import { RoleGuard } from "@/features/auth/components/RoleGuard.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <RoleGuard allowedRoles={["teamMember"]}>
          <div className="min-h-screen bg-gray-50 print:bg-white">
            <div className="flex">
              <div className="print:hidden">
                <Sidebar />
              </div>
              <main className="flex-1 p-4 lg:p-8 print:p-0">{children}</main>
            </div>
          </div>
        </RoleGuard>
      </SyncUser>
    </ProtectedRoute>
  );
}
