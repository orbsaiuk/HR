"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProfileHeader } from "./ProfileHeader";
import {
    Pencil,
    Globe,
    Github,
    Linkedin,
} from "lucide-react";

/**
 * Calculate profile completeness percentage and missing fields.
 */
function getProfileCompleteness(profile) {
    const checks = [
        { label: "الاسم", done: !!profile.name },
        { label: "العنوان المهني", done: !!profile.headline },
        { label: "النبذة", done: !!profile.bio },
        { label: "الموقع", done: !!profile.location },
        { label: "الهاتف", done: !!profile.phone },
        { label: "السيرة الذاتية", done: !!profile.uploadedResumeUrl || !!profile.resumeUrl },
        { label: "الخبرات العملية", done: profile.workExperience?.length > 0 },
        { label: "التعليم", done: profile.education?.length > 0 },
        { label: "المهارات", done: profile.skills?.length > 0 },
        { label: "الروابط الاجتماعية", done: !!profile.linkedinUrl || !!profile.githubUrl || !!profile.portfolioUrl },
    ];

    const completed = checks.filter((c) => c.done).length;
    const percentage = Math.round((completed / checks.length) * 100);
    const missing = checks.filter((c) => !c.done).map((c) => c.label);

    return { percentage, completed, total: checks.length, missing };
}

/**
 * Top card on the profile view page — gradient banner, avatar, bio, social links,
 * and a profile completeness indicator.
 */
export function ProfileHeaderCard({ profile }) {
    const hasSocial =
        profile.linkedinUrl || profile.githubUrl || profile.portfolioUrl;

    return (
        <Card className="overflow-hidden">
            {/* Gradient banner */}
            <div className="h-28 bg-gradient-to-l from-primary/25 via-primary/10 to-transparent" />

            <CardContent className="relative pt-0 -mt-12 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <ProfileHeader profile={profile} />
                    <Link href="/user/profile/edit" className="shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Pencil size={14} />
                            تعديل الملف الشخصي
                        </Button>
                    </Link>
                </div>

                {profile.bio && (
                    <>
                        <Separator className="my-4" />
                        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {profile.bio}
                        </p>
                    </>
                )}

                {hasSocial && (
                    <>
                        <Separator className="my-4" />
                        <SocialLinks profile={profile} />
                    </>
                )}
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */

function SocialLinks({ profile }) {
    const links = [
        {
            url: profile.linkedinUrl,
            icon: Linkedin,
            label: "لينكد إن",
        },
        {
            url: profile.githubUrl,
            icon: Github,
            label: "جيت هب",
        },
        {
            url: profile.portfolioUrl,
            icon: Globe,
            label: "معرض الأعمال",
        },
    ].filter((l) => !!l.url);

    return (
        <TooltipProvider>
            <div className="flex flex-wrap gap-2">
                {links.map(({ url, icon: Icon, label }) => (
                    <Tooltip key={label}>
                        <TooltipTrigger asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-1.5">
                                    <Icon size={14} />
                                    {label}
                                </Button>
                            </a>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{url}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
