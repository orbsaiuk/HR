"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useUserProfile } from "../model/useUserProfile";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import { profileSchema, profileDefaults } from "./schemas/profileSchema";
import { BasicInfoSection } from "./components/BasicInfoSection";
import { SocialLinksSection } from "./components/SocialLinksSection";
import { WorkExperienceSection } from "./components/WorkExperienceSection";
import { EducationSection } from "./components/EducationSection";
import { SkillsSection } from "./components/SkillsSection";
import { LanguagesSection } from "./components/LanguagesSection";
import { ResumeUploadSection } from "./components/ResumeUploadSection";
import { ArrowLeft, Save } from "lucide-react";

/**
 * Multi-section edit profile form.
 * Thin orchestrator — delegates sections to sub-components.
 */
export function EditProfilePage() {
    const { profile, loading, error: profileError, saving, updateProfile, uploadResume } =
        useUserProfile();

    const [resumeUploading, setResumeUploading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const methods = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: profileDefaults,
    });

    const { reset, handleSubmit, setValue, watch } = methods;

    // Populate form when profile loads
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                phone: profile.phone || "",
                headline: profile.headline || "",
                bio: profile.bio || "",
                location: profile.location || "",
                dateOfBirth: profile.dateOfBirth || "",
                resumeUrl: profile.resumeUrl || "",
                linkedinUrl: profile.linkedinUrl || "",
                githubUrl: profile.githubUrl || "",
                portfolioUrl: profile.portfolioUrl || "",
                workExperience: profile.workExperience || [],
                education: profile.education || [],
                skills: profile.skills || [],
                languages: profile.languages || [],
            });
        }
    }, [profile, reset]);

    // Watch array fields for sub-components
    const workExperience = watch("workExperience");
    const education = watch("education");
    const skills = watch("skills");
    const languages = watch("languages");
    const resumeUrl = watch("resumeUrl");

    const onSubmit = async (data) => {
        try {
            setSaveSuccess(false);
            await updateProfile(data);
            setSaveSuccess(true);
        } catch {
            // error is set by the hook
        }
    };

    const handleResumeUpload = async (file) => {
        try {
            setResumeUploading(true);
            await uploadResume(file);
        } catch {
            // error is set by the hook
        } finally {
            setResumeUploading(false);
        }
    };

    if (loading) return <Loading fullPage />;
    if (profileError && !profile) return <Error message={profileError} />;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/user/profile">
                            <Button type="button" variant="ghost" size="sm">
                                <ArrowLeft size={16} />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                    </div>
                    <Button type="submit" disabled={saving}>
                        <Save size={14} className="mr-1" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {saveSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3">
                        Profile saved successfully.
                    </div>
                )}

                {profileError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                        {profileError}
                    </div>
                )}

                {/* Basic Info */}
                <BasicInfoSection />

                {/* Resume */}
                <ResumeUploadSection
                    resumeUrl={profile?.resumeUrl}
                    externalResumeUrl={resumeUrl}
                    editable
                    onUpload={handleResumeUpload}
                    onExternalUrlChange={(url) => setValue("resumeUrl", url, { shouldValidate: true })}
                    uploading={resumeUploading}
                />

                {/* Work Experience */}
                <WorkExperienceSection
                    entries={workExperience}
                    editable
                    onChange={(entries) => setValue("workExperience", entries)}
                />

                {/* Education */}
                <EducationSection
                    entries={education}
                    editable
                    onChange={(entries) => setValue("education", entries)}
                />

                {/* Skills */}
                <SkillsSection
                    skills={skills}
                    editable
                    onChange={(updated) => setValue("skills", updated)}
                />

                {/* Languages */}
                <LanguagesSection
                    languages={languages}
                    editable
                    onChange={(updated) => setValue("languages", updated)}
                />

                {/* Social Links */}
                <SocialLinksSection />

                {/* Bottom save button */}
                <div className="flex justify-end pb-8">
                    <Button type="submit" disabled={saving}>
                        <Save size={14} className="mr-1" />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
