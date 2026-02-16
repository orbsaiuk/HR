"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    ArrowRight,
    CheckCircle2,
    Zap,
    Shield,
    Users,
    TrendingUp,
} from "lucide-react";

const FEATURES = [
    "Post unlimited job positions",
    "Custom application forms",
    "Candidate evaluation scorecards",
    "Team collaboration & messaging",
    "Analytics & reporting",
];

const CARDS = [
    {
        icon: Zap,
        title: "Quick Setup",
        desc: "Get started in minutes",
        color: "bg-yellow-50 text-yellow-600",
    },
    {
        icon: Shield,
        title: "Secure",
        desc: "Enterprise-grade security",
        color: "bg-blue-50 text-blue-600",
    },
    {
        icon: Users,
        title: "Team Tools",
        desc: "Collaborate with your team",
        color: "bg-green-50 text-green-600",
    },
    {
        icon: TrendingUp,
        title: "Analytics",
        desc: "Track your hiring pipeline",
        color: "bg-purple-50 text-purple-600",
    },
];

export function ForEmployersSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                    <div>
                        <Badge variant="secondary" className="mb-4">
                            For Employers
                        </Badge>
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            Hire the Best Talent for Your Team
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            Register your organization, create job postings, and manage
                            applications — all in one platform. Build your employer brand and
                            reach qualified candidates.
                        </p>

                        <ul className="space-y-3 mb-8">
                            {FEATURES.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-2 text-sm text-foreground"
                                >
                                    <CheckCircle2
                                        size={16}
                                        className="text-green-500 shrink-0"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="flex gap-3">
                            <Button asChild>
                                <Link href="/register-organization">
                                    Register Your Company
                                    <ArrowRight size={16} className="ml-2" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/careers">See Who&apos;s Hiring</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {CARDS.map((item) => (
                            <Card key={item.title}>
                                <CardContent className="pt-6 text-center">
                                    <div
                                        className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}
                                    >
                                        <item.icon size={22} />
                                    </div>
                                    <h3 className="font-semibold text-sm text-foreground">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {item.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
