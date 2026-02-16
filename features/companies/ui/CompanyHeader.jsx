"use client";

import Link from "next/link";
import { urlFor } from "@/shared/lib/sanityImage";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Users, Globe, Calendar } from "lucide-react";

const INDUSTRY_LABELS = {
    technology: "Technology",
    healthcare: "Healthcare",
    finance: "Finance",
    education: "Education",
    retail: "Retail",
    manufacturing: "Manufacturing",
    consulting: "Consulting",
    media: "Media & Entertainment",
    nonprofit: "Non-Profit",
    government: "Government",
    other: "Other",
};

export function CompanyHeader({ company }) {
    const logoUrl = company.logo
        ? urlFor(company.logo).width(120).height(120).url()
        : null;

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to careers
                </Link>

                <div className="flex flex-col md:flex-row items-start gap-6">
                    {logoUrl ? (
                        <img
                            src={logoUrl}
                            alt={`${company.name} logo`}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover border border-gray-200 shrink-0"
                        />
                    ) : (
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-3xl font-bold text-blue-600">
                                {company.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                    )}

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {company.name}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {company.industry && (
                                <Badge variant="secondary">
                                    {INDUSTRY_LABELS[company.industry] || company.industry}
                                </Badge>
                            )}
                            {company.location && (
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin size={14} />
                                    {company.location}
                                </span>
                            )}
                            {company.size && (
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users size={14} />
                                    {company.size} employees
                                </span>
                            )}
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    <Globe size={14} />
                                    Website
                                </a>
                            )}
                        </div>

                        {company.createdAt && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar size={12} />
                                Member since{" "}
                                {new Date(company.createdAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
