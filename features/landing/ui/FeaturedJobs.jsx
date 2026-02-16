"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PositionCard } from "@/features/careers/ui/components/PositionCard";
import { ArrowRight } from "lucide-react";

export function FeaturedJobs() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/platform/featured-positions")
            .then((res) => res.json())
            .then((data) => {
                setPositions(Array.isArray(data) ? data : []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-64 mx-auto" />
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-48 bg-gray-100 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (positions.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        Featured Positions
                    </h2>
                    <p className="text-muted-foreground">
                        Explore the latest opportunities from top companies
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {positions.map((position) => (
                        <PositionCard key={position._id} position={position} />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/careers">
                            View All Jobs
                            <ArrowRight size={16} className="ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
