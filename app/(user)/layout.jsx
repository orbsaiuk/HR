import { Header } from "@/shared/components/layout/Header.jsx";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute>
      <SyncUser>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </SyncUser>
    </ProtectedRoute>
  );
}
