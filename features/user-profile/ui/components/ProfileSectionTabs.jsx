"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { ResumeUploadSection } from "./ResumeUploadSection";
import {
    Briefcase,
    GraduationCap,
    Sparkles,
    Languages,
    FileText,
    Pencil,
} from "lucide-react";

/**
 * Read-only tabbed view of profile sections (experience, education, etc.).
 */
export function ProfileSectionTabs({ profile }) {
    const hasWork = profile.workExperience?.length > 0;
    const hasEdu = profile.education?.length > 0;
    const hasSkills = profile.skills?.length > 0;
    const hasLanguages = profile.languages?.length > 0;
    const hasResume = !!profile.uploadedResumeUrl || !!profile.resumeUrl;

    // Determine best default tab (first one with content, or "experience")
    const defaultTab = hasWork
        ? "experience"
        : hasEdu
            ? "education"
            : hasSkills
                ? "skills"
                : hasLanguages
                    ? "languages"
                    : hasResume
                        ? "resume"
                        : "experience";

    return (
        <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="experience" className="gap-1.5">
                    <Briefcase size={14} />
                    Experience
                    {hasWork && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {profile.workExperience.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="education" className="gap-1.5">
                    <GraduationCap size={14} />
                    Education
                    {hasEdu && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {profile.education.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-1.5">
                    <Sparkles size={14} />
                    Skills
                    {hasSkills && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {profile.skills.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="languages" className="gap-1.5">
                    <Languages size={14} />
                    Languages
                    {hasLanguages && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {profile.languages.length}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="resume" className="gap-1.5">
                    <FileText size={14} />
                    Resume
                    {hasResume && (
                        <span className="ml-1 h-2 w-2 rounded-full bg-green-500 inline-block" />
                    )}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="experience" className="mt-4">
                {hasWork ? (
                    <WorkExperienceSection entries={profile.workExperience} />
                ) : (
                    <EmptySection
                        icon={Briefcase}
                        title="No work experience yet"
                        description="Add your work history to showcase your professional background."
                    />
                )}
            </TabsContent>

            <TabsContent value="education" className="mt-4">
                {hasEdu ? (
                    <EducationSection entries={profile.education} />
                ) : (
                    <EmptySection
                        icon={GraduationCap}
                        title="No education added yet"
                        description="Add your educational background to strengthen your profile."
                    />
                )}
            </TabsContent>

            <TabsContent value="skills" className="mt-4">
                {hasSkills ? (
                    <SkillsSection skills={profile.skills} />
                ) : (
                    <EmptySection
                        icon={Sparkles}
                        title="No skills added yet"
                        description="Highlight your key skills to stand out to potential employers."
                    />
                )}
            </TabsContent>

            <TabsContent value="languages" className="mt-4">
                {hasLanguages ? (
                    <LanguagesSection languages={profile.languages} />
                ) : (
                    <EmptySection
                        icon={Languages}
                        title="No languages added yet"
                        description="List the languages you speak and your proficiency level."
                    />
                )}
            </TabsContent>

            <TabsContent value="resume" className="mt-4">
                {hasResume ? (
                    <ResumeUploadSection
                        resumeUrl={profile.uploadedResumeUrl}
                        externalResumeUrl={profile.resumeUrl}
                    />
                ) : (
                    <EmptySection
                        icon={FileText}
                        title="No resume uploaded yet"
                        description="Upload your resume or paste an external link to make applying easier."
                    />
                )}
            </TabsContent>
        </Tabs>
    );
}

/* ------------------------------------------------------------------ */

/**
 * Polished empty state with icon, message, and CTA to edit profile.
 */
function EmptySection({ icon: Icon, title, description }) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                    <Icon size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                    {description}
                </p>
                <Link href="/user/profile/edit">
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <Pencil size={14} />
                        Edit Profile
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
