"use client";

import Link from "next/link";
import { useUserProfile } from "../model/useUserProfile";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHeader } from "./components/ProfileHeader";
import { WorkExperienceSection } from "./components/WorkExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { SkillsSection } from "./components/SkillsSection";
import { LanguagesSection } from "./components/LanguagesSection";
import { ResumeUploadSection } from "./components/ResumeUploadSection";
import { Pencil, Globe, Github, Linkedin } from "lucide-react";

/**
 * Read-only view of the current user's profile.
 */
export function UserProfilePage() {
    const { profile, loading, error } = useUserProfile();

    if (loading) return <Loading fullPage />;
    if (error) return <Error message={error} />;
    if (!profile) return <Error message="Profile not found" />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header + Edit button */}
            <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <Link href="/user/profile/edit">
                    <Button variant="outline" size="sm">
                        <Pencil size={14} className="mr-1" />
                        Edit Profile
                    </Button>
                </Link>
            </div>

            {/* Profile header card */}
            <Card>
                <CardContent className="pt-6">
                    <ProfileHeader profile={profile} />

                    {profile.bio && (
                        <p className="mt-4 text-sm text-gray-600 whitespace-pre-line">
                            {profile.bio}
                        </p>
                    )}

                    {/* Social links */}
                    {(profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl) && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {profile.linkedinUrl && (
                                <a
                                    href={profile.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                >
                                    <Linkedin size={14} />
                                    LinkedIn
                                </a>
                            )}
                            {profile.githubUrl && (
                                <a
                                    href={profile.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
                                >
                                    <Github size={14} />
                                    GitHub
                                </a>
                            )}
                            {profile.portfolioUrl && (
                                <a
                                    href={profile.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-gray-700 hover:underline"
                                >
                                    <Globe size={14} />
                                    Portfolio
                                </a>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resume */}
            <ResumeUploadSection
                resumeUrl={profile.resumeUrl}
                externalResumeUrl={profile.resumeUrl}
            />

            {/* Work Experience */}
            <WorkExperienceSection entries={profile.workExperience} />

            {/* Education */}
            <EducationSection entries={profile.education} />

            {/* Skills */}
            <SkillsSection skills={profile.skills} />

            {/* Languages */}
            <LanguagesSection languages={profile.languages} />
        </div>
    );
}
