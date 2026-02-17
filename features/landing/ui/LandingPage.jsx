"use client";

import { HeroSection } from "./HeroSection";
import { FeaturedJobs } from "./FeaturedJobs";
import { HowItWorks } from "./HowItWorks";
import { ForEmployersSection } from "./ForEmployersSection";
import { CTABanner } from "./CTABanner";
import {
    Search,
    FileText,
    CheckCircle,
    Building2,
    Users,
    Briefcase,
    BarChart3,
    MessageSquare,
} from "lucide-react";

const CANDIDATE_STEPS = [
    {
        icon: Search,
        title: "Search Jobs",
        description:
            "Browse open positions by title, location, or company. Filter by job type, salary range, and more.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: FileText,
        title: "Apply Online",
        description:
            "Submit your application with a few clicks. Upload your resume and fill out custom application forms.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: CheckCircle,
        title: "Get Hired",
        description:
            "Track your application status in real time. Communicate directly with hiring teams through the platform.",
        color: "bg-green-50 text-green-600",
    },
];

const EMPLOYER_STEPS = [
    {
        icon: Building2,
        title: "Register Your Organization",
        description:
            "Create your company profile in minutes. Add your logo, description, and team members.",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        icon: FileText,
        title: "Post Positions",
        description:
            "Create job listings with custom application forms. Set requirements, salary ranges, and more.",
        color: "bg-teal-50 text-teal-600",
    },
    {
        icon: Users,
        title: "Manage Your Pipeline",
        description:
            "Review applications, score candidates with scorecards, and collaborate with your hiring team.",
        color: "bg-green-50 text-green-600",
    },
];

const TEAM_MEMBER_STEPS = [
    {
        icon: Briefcase,
        title: "Post Positions",
        description:
            "Create and publish job listings with custom application forms, requirements, and salary details.",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: MessageSquare,
        title: "Review & Communicate",
        description:
            "Evaluate candidates with scorecards, collaborate with your team, and message applicants directly.",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        icon: BarChart3,
        title: "Track & Hire",
        description:
            "Monitor your hiring pipeline with analytics, manage application statuses, and make data-driven decisions.",
        color: "bg-green-50 text-green-600",
    },
];

export function LandingPage({ isTeamMember = false, isSignedIn = false }) {
    return (
        <>
            <HeroSection />
            <FeaturedJobs />
            {isTeamMember ? (
                <HowItWorks title="Your Hiring Workflow" steps={TEAM_MEMBER_STEPS} />
            ) : (
                <>
                    <HowItWorks title="How It Works" steps={CANDIDATE_STEPS} />
                    <ForEmployersSection />
                    <HowItWorks
                        title="Get Started in 3 Steps"
                        steps={EMPLOYER_STEPS}
                    />
                </>
            )}
            <CTABanner
                title="Ready to Get Started?"
                description={
                    isTeamMember
                        ? "Manage your team, post positions, and find the best talent for your organization."
                        : "Whether you're looking for your next role or hiring top talent, HireHub has you covered."
                }
                primaryAction={
                    isTeamMember
                        ? { label: "Go to Dashboard", href: "/dashboard" }
                        : { label: "Browse Jobs", href: "/careers" }
                }
                secondaryAction={
                    isTeamMember
                        ? { label: "Browse Jobs", href: "/careers" }
                        : isSignedIn
                            ? null
                            : { label: "Register Your Company", href: "/register-organization" }
                }
                variant="blue"
            />
        </>
    );
}
