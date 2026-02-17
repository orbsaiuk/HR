"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

/**
 * Calculate profile completeness percentage and missing fields.
 */
function getProfileCompleteness(profile) {
    const checks = [
        { label: "Name", done: !!profile.name },
        { label: "Headline", done: !!profile.headline },
        { label: "Bio", done: !!profile.bio },
        { label: "Location", done: !!profile.location },
        { label: "Phone", done: !!profile.phone },
        { label: "Resume", done: !!profile.uploadedResumeUrl || !!profile.resumeUrl },
        { label: "Work experience", done: profile.workExperience?.length > 0 },
        { label: "Education", done: profile.education?.length > 0 },
        { label: "Skills", done: profile.skills?.length > 0 },
        { label: "Social links", done: !!profile.linkedinUrl || !!profile.githubUrl || !!profile.portfolioUrl },
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
    const completeness = getProfileCompleteness(profile);
    const isComplete = completeness.percentage === 100;

    return (
        <Card className="overflow-hidden">
            {/* Gradient banner */}
            <div className="h-28 bg-gradient-to-r from-primary/25 via-primary/10 to-transparent" />

            <CardContent className="relative pt-0 -mt-12 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <ProfileHeader profile={profile} />
                    <Link href="/user/profile/edit" className="shrink-0">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Pencil size={14} />
                            Edit Profile
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

                {/* Profile completeness */}
                <Separator className="my-4" />
                <ProfileCompletenessBar completeness={completeness} isComplete={isComplete} />
            </CardContent>
        </Card>
    );
}

/* ------------------------------------------------------------------ */

function ProfileCompletenessBar({ completeness, isComplete }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isComplete ? (
                        <CheckCircle2 size={16} className="text-green-600" />
                    ) : (
                        <AlertCircle size={16} className="text-amber-500" />
                    )}
                    <span className="text-sm font-medium">
                        Profile {completeness.percentage}% complete
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {completeness.completed}/{completeness.total} sections
                </span>
            </div>
            <Progress
                value={completeness.percentage}
                className="h-2"
            />
            {!isComplete && completeness.missing.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Missing: {completeness.missing.join(", ")}
                </p>
            )}
        </div>
    );
}

/* ------------------------------------------------------------------ */

function SocialLinks({ profile }) {
    const links = [
        {
            url: profile.linkedinUrl,
            icon: Linkedin,
            label: "LinkedIn",
        },
        {
            url: profile.githubUrl,
            icon: Github,
            label: "GitHub",
        },
        {
            url: profile.portfolioUrl,
            icon: Globe,
            label: "Portfolio",
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
