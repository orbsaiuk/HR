"use client";

import Image from "next/image";
import { urlFor } from "@/shared/lib/sanityImage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    SquarePen,
    MapPin,
    Users,
    Flame,
    Building2,
} from "lucide-react";

const INDUSTRY_LABELS = {
    technology: "التصميم",
    healthcare: "الرعاية الصحية",
    finance: "الخدمات المالية",
    education: "التعليم",
    retail: "التجزئة",
    manufacturing: "التصنيع",
    consulting: "الاستشارات",
    media: "الإعلام والترفيه",
    nonprofit: "غير ربحي",
    government: "حكومي",
    other: "أخرى",
};

const SIZE_EMPLOYEE_COUNT = {
    "1-10": "10",
    "11-50": "50",
    "51-200": "200",
    "201-500": "500",
    "500+": "500+",
};

/**
 * Company profile header section with logo, name, website, stats.
 */
export function CompanyProfileHeader({ company, onEdit }) {
    const logoUrl = company.logo ? urlFor(company.logo).width(200).height(200).url() : null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-6">
            <div className="flex flex-col gap-4">
                {/* Top Section: Avatar & Info */}
                <div className="flex flex-row items-center gap-6 w-full">
                    {/* Avatar with Edit Button */}
                    <div className="relative shrink-0">
                        <Avatar className="w-24 h-24 rounded-full border border-gray-100 dark:border-gray-800">
                            {logoUrl ? (
                                <AvatarImage
                                    src={logoUrl}
                                    alt={`شعار ${company.name}`}
                                    className="object-contain"
                                />
                            ) : null}
                            <AvatarFallback className="rounded-full bg-[#0a0a0a] text-white text-3xl font-bold">
                                {company.name?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-0 -left-2 w-7 h-7 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[#462EA8] hover:text-[#462EA8] hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center shadow-sm"
                            onClick={onEdit}
                        >
                            <SquarePen size={12} strokeWidth={2.5} />
                        </Button>
                    </div>

                    {/* Title and Website */}
                    <div className="text-start flex-1">
                        <h1 className="text-3xl md:text-4xl font-normal text-slate-800 dark:text-slate-100 font-sans tracking-tight">
                            {company.name}
                        </h1>
                        {company.website && (
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm md:text-base font-semibold text-[#462EA8] hover:underline mt-1 inline-block"
                            >
                                {company.website}
                            </a>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Stats */}
                <div className="flex flex-wrap items-center gap-6 lg:gap-10 w-full pt-2">
                    {company.industry && (
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] shrink-0 rounded-full border border-[#462EA8]/20 flex items-center justify-center bg-white dark:bg-gray-800 text-[#462EA8]">
                                <Building2 size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-[11px] md:text-[13px] text-muted-foreground font-medium mb-0.5">المجال</span>
                                <span className="text-sm md:text-[15px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                    {INDUSTRY_LABELS[company.industry] || company.industry}
                                </span>
                            </div>
                        </div>
                    )}

                    {company.location && (
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] shrink-0 rounded-full border border-[#462EA8]/20 flex items-center justify-center bg-white dark:bg-gray-800 text-[#462EA8]">
                                <MapPin size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-[11px] md:text-[13px] text-muted-foreground font-medium mb-0.5">الموقع</span>
                                <span className="text-sm md:text-[15px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                    {company.location}
                                </span>
                            </div>
                        </div>
                    )}

                    {company.size && (
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] shrink-0 rounded-full border border-[#462EA8]/20 flex items-center justify-center bg-white dark:bg-gray-800 text-[#462EA8]">
                                <Users size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-[11px] md:text-[13px] text-muted-foreground font-medium mb-0.5">عدد الموظفين</span>
                                <span className="text-sm md:text-[15px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                    {SIZE_EMPLOYEE_COUNT[company.size] || company.size}
                                </span>
                            </div>
                        </div>
                    )}

                    {company.foundedYear && (
                        <div className="flex items-center gap-3">
                            <div className="w-[42px] h-[42px] shrink-0 rounded-full border border-[#462EA8]/20 flex items-center justify-center bg-white dark:bg-gray-800 text-[#462EA8]">
                                <Flame size={18} strokeWidth={1.5} />
                            </div>
                            <div className="flex flex-col text-start">
                                <span className="text-[11px] md:text-[13px] text-muted-foreground font-medium mb-0.5">تاريخ التأسيس</span>
                                <span className="text-sm md:text-[15px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                    {company.foundedYear}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
