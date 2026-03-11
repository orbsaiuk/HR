"use client";

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/shared/lib/sanityImage";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, MapPin, Users, Globe, Calendar } from "lucide-react";

const INDUSTRY_LABELS = {
    technology: "تكنولوجيا",
    healthcare: "رعاية صحية",
    finance: "مالية",
    education: "تعليم",
    retail: "تجارة التجزئة",
    manufacturing: "تصنيع",
    consulting: "استشارات",
    media: "إعلام وترفيه",
    nonprofit: "غير ربحي",
    government: "حكومي",
    other: "أخرى",
};

const SIZE_LABELS = {
    "1-10": "1-10 موظفين",
    "11-50": "11-50 موظف",
    "51-200": "51-200 موظف",
    "201-500": "201-500 موظف",
    "500+": "500+ موظف",
};

export function CompanyHeader({ company }) {
    const logoUrl = company.logo
        ? urlFor(company.logo).url()
        : null;

    return (
        <div className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4 py-6">
                <Link
                    href="/careers"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowRight size={16} className="rtl:rotate-0 ltr:rotate-180" />
                    العودة إلى الوظائف
                </Link>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <Avatar className="w-20 h-20 md:w-24 md:h-24 rounded-xl border border-gray-200 shrink-0">
                        {logoUrl ? (
                            <AvatarImage
                                src={logoUrl}
                                alt={`شعار ${company.name}`}
                                className="object-contain"
                            />
                        ) : null}
                        <AvatarFallback className="rounded-xl bg-blue-100 text-3xl font-bold text-blue-600">
                            {company.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {company.name}
                        </h1>

                        <div className="flex flex-wrap gap-3 mb-4">
                            {company.location && (
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin size={14} />
                                    {company.location}
                                </span>
                            )}
                            {company.size && (
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Users size={14} />
                                    {SIZE_LABELS[company.size] || `${company.size} موظف`}
                                </span>
                            )}
                            {company.website && (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    <Globe size={14} />
                                    الموقع الإلكتروني
                                </a>
                            )}
                            {company.createdAt && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar size={12} />
                                    عضو منذ{" "}
                                    {new Date(company.createdAt).toLocaleDateString("ar-EG", {
                                        month: "long",
                                        year: "numeric",
                                    })}
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

