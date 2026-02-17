"use client";

import { useUserProfile } from "../model/useUserProfile";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { ProfileSectionTabs } from "./components/ProfileSectionTabs";

/**
 * Read-only view of the current user's profile.
 * Delegates rendering to ProfileHeaderCard and ProfileSectionTabs.
 */
export function UserProfilePage() {
    const { profile, loading, error } = useUserProfile();

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} />;
    if (!profile) return <Error message="Profile not found" />;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your personal information and professional details.
                </p>
            </div>
            <ProfileHeaderCard profile={profile} />
            <ProfileSectionTabs profile={profile} />
        </div>
    );
}
