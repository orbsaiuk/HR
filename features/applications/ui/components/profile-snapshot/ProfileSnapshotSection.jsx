"use client";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";
import { ProfileSnapshotHeader } from "./ProfileSnapshotHeader";
import { ProfileSnapshotExperience } from "./ProfileSnapshotExperience";
import { ProfileSnapshotEducation } from "./ProfileSnapshotEducation";
import { ProfileSnapshotSkills } from "./ProfileSnapshotSkills";
import { ProfileSnapshotResume } from "./ProfileSnapshotResume";
import { ProfileSnapshotLinks } from "./ProfileSnapshotLinks";

export function ProfileSnapshotSection({ profileSnapshot, applicantName, applicantEmail }) {
    if (!profileSnapshot) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserCircle size={20} />
                    Applicant Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <ProfileSnapshotHeader
                    snapshot={profileSnapshot}
                    applicantName={applicantName}
                    applicantEmail={applicantEmail}
                />

                {profileSnapshot.bio && (
                    <p className="text-sm text-muted-foreground">{profileSnapshot.bio}</p>
                )}

                <ProfileSnapshotExperience
                    workExperience={profileSnapshot.workExperience}
                />
                <ProfileSnapshotEducation education={profileSnapshot.education} />
                <ProfileSnapshotSkills skills={profileSnapshot.skills} />
                <ProfileSnapshotResume resumeUrl={profileSnapshot.resumeUrl} />
                <ProfileSnapshotLinks snapshot={profileSnapshot} />
            </CardContent>
        </Card>
    );
}
