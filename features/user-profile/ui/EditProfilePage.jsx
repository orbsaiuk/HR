"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserProfile } from "../model/useUserProfile";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { profileSchema, profileDefaults } from "./schemas/profileSchema";
import { EditProfileHeader } from "./components/EditProfileHeader";
import { EditProfileTabs } from "./components/EditProfileTabs";
import { Save } from "lucide-react";

/**
 * Multi-section edit profile form.
 *
 * The CV/resume file is **staged locally** and only uploaded when the user
 * clicks "Save Changes". Toast notifications are used for feedback — no
 * page reloads occur.
 */
export function EditProfilePage() {
    const router = useRouter();
    const {
        profile,
        loading,
        error: profileError,
        saving,
        updateProfile,
        uploadResume,
        removeResume,
    } = useUserProfile();

    const [stagedResumeFile, setStagedResumeFile] = useState(null);
    const [pendingResumeRemoval, setPendingResumeRemoval] = useState(false);

    const methods = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: profileDefaults,
    });

    const { reset, handleSubmit, setValue, watch, formState } = methods;

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
    const externalResumeUrl = watch("resumeUrl");

    /**
     * Submit handler — saves profile data first, then uploads the staged
     * resume file (if any). Uses toast for feedback, no page reload.
     */
    const onSubmit = useCallback(
        async (data) => {
            try {
                // 1. Save profile fields
                await updateProfile(data);

                // 2. Remove resume if user requested removal
                if (pendingResumeRemoval && !stagedResumeFile) {
                    await removeResume();
                    setPendingResumeRemoval(false);
                }

                // 3. Upload staged resume file (if user selected one)
                if (stagedResumeFile) {
                    await uploadResume(stagedResumeFile);
                    setStagedResumeFile(null);
                    setPendingResumeRemoval(false);
                }

                toast.success("Profile updated successfully");
                router.push("/user/profile");
            } catch (err) {
                toast.error(err.message || "Failed to save profile");
            }
        },
        [updateProfile, uploadResume, removeResume, stagedResumeFile, pendingResumeRemoval]
    );

    if (loading) return <Loading fullPage />;
    if (profileError && !profile) return <Error message={profileError} />;

    const isDirty = formState.isDirty || !!stagedResumeFile || pendingResumeRemoval;

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-4xl mx-auto space-y-6"
            >
                <EditProfileHeader saving={saving} isDirty={isDirty} />

                {/* Tabbed sections */}
                <EditProfileTabs
                    profile={profile}
                    workExperience={workExperience}
                    education={education}
                    skills={skills}
                    languages={languages}
                    externalResumeUrl={externalResumeUrl}
                    stagedResumeFile={stagedResumeFile}
                    setValue={setValue}
                    onFileStaged={(file) => setStagedResumeFile(file)}
                    onResumeRemove={() => setPendingResumeRemoval(true)}
                />

                <Separator />

                {/* Bottom actions */}
                <div className="flex items-center justify-between pb-8">
                    <Link href="/user/profile">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={saving} className="gap-1.5">
                        <Save size={14} />
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
