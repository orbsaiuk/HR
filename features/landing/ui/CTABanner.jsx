"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTABanner({
    title,
    description,
    primaryAction,
    secondaryAction,
    variant = "blue",
}) {
    const bgClass =
        variant === "blue"
            ? "bg-linear-to-r from-blue-600 to-indigo-700"
            : "bg-linear-to-r from-emerald-600 to-teal-700";

    return (
        <section className={`${bgClass} text-white py-16`}>
            <div className="container mx-auto px-4 text-center max-w-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
                <p className="text-lg text-white/80 mb-8">{description}</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {primaryAction && (
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold"
                        >
                            <Link href={primaryAction.href}>
                                {primaryAction.label}
                                <ArrowRight size={16} className="ml-2" />
                            </Link>
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                        >
                            <Link href={secondaryAction.href}>
                                {secondaryAction.label}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}
