"use client";

import { ProfilePreviewCard } from "./components/ProfilePreviewCard";
import { ApplicationSubmitButton } from "./components/ApplicationSubmitButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pencil } from "lucide-react";

export function ApplyWithProfileSection({ profile, onSubmit, submitting }) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                This position accepts applications via your profile. Review your profile
                below and submit when ready.
            </p>

            <ProfilePreviewCard profile={profile} />

            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/user/profile/edit">
                        <Pencil size={14} className="mr-1" />
                        Edit Profile
                    </Link>
                </Button>
            </div>

            <ApplicationSubmitButton onClick={onSubmit} submitting={submitting}>
                Submit with Profile
            </ApplicationSubmitButton>
        </div>
    );
}
