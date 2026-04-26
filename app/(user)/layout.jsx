import { ProtectedRoute } from "@/features/shared/auth/components/ProtectedRoute.jsx";
import { ProfileCompletionBanner } from "@/features/user/profile";

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="bg-gray-50">
        <main className="container mx-auto px-4 py-8 min-h-screen">
          <ProfileCompletionBanner />
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
