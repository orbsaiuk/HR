"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { ProfilePreviewHeader } from "./ProfilePreviewHeader";
import { ProfilePreviewExperience } from "./ProfilePreviewExperience";
import { ProfilePreviewEducation } from "./ProfilePreviewEducation";
import { ProfilePreviewSkills } from "./ProfilePreviewSkills";
import { ProfilePreviewResume } from "./ProfilePreviewResume";
import { UserCircle } from "lucide-react";

export function ProfilePreviewCard({ profile }) {
    if (!profile) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle size={20} />
                    Your Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ProfilePreviewHeader profile={profile} />

                {profile.bio && (
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}

                <ProfilePreviewExperience workExperience={profile.workExperience} />
                <ProfilePreviewEducation education={profile.education} />
                <ProfilePreviewSkills skills={profile.skills} />
                <ProfilePreviewResume resumeUrl={profile.resumeUrl} />

                {(profile.linkedinUrl || profile.portfolioUrl) && (
                    <div className="flex gap-3 text-sm">
                        {profile.linkedinUrl && (
                            <a
                                href={profile.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                LinkedIn
                            </a>
                        )}
                        {profile.portfolioUrl && (
                            <a
                                href={profile.portfolioUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Portfolio
                            </a>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
