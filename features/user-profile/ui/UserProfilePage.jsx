"use client";

import { useUserProfile } from "../model/useUserProfile";
import { Error } from "@/shared/components/feedback/Error";
import { UserProfileSkeleton } from "./UserProfileSkeleton";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { ProfileSectionTabs } from "./components/ProfileSectionTabs";

/**
 * Read-only view of the current user's profile.
 * Delegates rendering to ProfileHeaderCard and ProfileSectionTabs.
 */
export function UserProfilePage() {
  const { profile, loading, error } = useUserProfile();

  if (loading) return <UserProfileSkeleton />;
  if (error) return <Error message={error} />;
  if (!profile) return <Error message="الملف الشخصي غير موجود" />;

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-6 pb-8">
      <div>
        <h1 className="text-lg md:text-3xl tracking-tight">ملفي الشخصي</h1>
        <p className="text-sm text-muted-foreground mt-1">
          إدارة معلوماتك الشخصية وتفاصيلك المهنية.
        </p>
      </div>
      <ProfileHeaderCard profile={profile} />
      <ProfileSectionTabs profile={profile} />
    </div>
  );
}
