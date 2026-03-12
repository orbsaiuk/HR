"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicInfoSection } from "./BasicInfoSection";
import { SocialLinksSection } from "./SocialLinksSection";
import { WorkExperienceSection } from "./WorkExperienceSection";
import { EducationSection } from "./EducationSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { ResumeUploadSection } from "./ResumeUploadSection";
import {
    User,
    Briefcase,
    GraduationCap,
    Sparkles,
    FileText,
    Link as LinkIcon,
} from "lucide-react";

/**
 * Tabbed editing sections for the profile edit form.
 *
 * Props come from the parent EditProfilePage which owns the form state.
 */
export function EditProfileTabs({
    profile,
    workExperience,
    education,
    skills,
    languages,
    externalResumeUrl,
    stagedResumeFile,
    setValue,
    onFileStaged,
    onResumeRemove,
}) {
    const isFreelancer = profile?.accountType === "freelancer";

    return (
        <Tabs defaultValue="basic" className="w-full">
            <TabsList className="w-fit justify-start overflow-x-auto">
                <TabsTrigger value="basic" className="gap-1.5">
                    <User size={14} />
                    المعلومات الأساسية
                </TabsTrigger>
                <TabsTrigger value="skills" className="gap-1.5">
                    <Sparkles size={14} />
                    المهارات واللغات
                </TabsTrigger>
                {isFreelancer && (
                    <TabsTrigger value="social" className="gap-1.5">
                        <LinkIcon size={14} />
                        معرض الأعمال والروابط
                    </TabsTrigger>
                )}
                <TabsTrigger value="experience" className="gap-1.5">
                    <Briefcase size={14} />
                    الخبرات
                </TabsTrigger>
                {!isFreelancer && (
                    <TabsTrigger value="education" className="gap-1.5">
                        <GraduationCap size={14} />
                        التعليم
                    </TabsTrigger>
                )}
                {!isFreelancer && (
                    <TabsTrigger value="resume" className="gap-1.5">
                        <FileText size={14} />
                        السيرة الذاتية
                        {stagedResumeFile && (
                            <span className="me-1 h-2 w-2 rounded-full bg-amber-500 inline-block" />
                        )}
                    </TabsTrigger>
                )}
                {!isFreelancer && (
                    <TabsTrigger value="social" className="gap-1.5">
                        <LinkIcon size={14} />
                        الروابط
                    </TabsTrigger>
                )}
            </TabsList>

            <TabsContent value="basic" className="mt-4 space-y-4">
                <BasicInfoSection />
            </TabsContent>

            <TabsContent value="experience" className="mt-4 space-y-4">
                <WorkExperienceSection
                    entries={workExperience}
                    editable
                    onChange={(entries) =>
                        setValue("workExperience", entries, { shouldDirty: true })
                    }
                />
            </TabsContent>

            <TabsContent value="education" className="mt-4 space-y-4">
                <EducationSection
                    entries={education}
                    editable
                    onChange={(entries) =>
                        setValue("education", entries, { shouldDirty: true })
                    }
                />
            </TabsContent>

            <TabsContent value="skills" className="mt-4 space-y-4">
                <SkillsSection
                    skills={skills}
                    editable
                    onChange={(updated) =>
                        setValue("skills", updated, { shouldDirty: true })
                    }
                />
                <LanguagesSection
                    languages={languages}
                    editable
                    onChange={(updated) =>
                        setValue("languages", updated, { shouldDirty: true })
                    }
                />
            </TabsContent>

            <TabsContent value="resume" className="mt-4 space-y-4">
                <ResumeUploadSection
                    resumeUrl={profile?.uploadedResumeUrl}
                    externalResumeUrl={externalResumeUrl}
                    editable
                    stagedFile={stagedResumeFile}
                    onFileStaged={onFileStaged}
                    onResumeRemove={onResumeRemove}
                    onExternalUrlChange={(url) =>
                        setValue("resumeUrl", url, {
                            shouldValidate: true,
                            shouldDirty: true,
                        })
                    }
                />
            </TabsContent>

            <TabsContent value="social" className="mt-4 space-y-4">
                <SocialLinksSection />
            </TabsContent>
        </Tabs>
    );
}
