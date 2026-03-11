"use client";

import { useEffect } from "react";
import { useCompanyDetail } from "../model/useCompanyDetail";
import { CompanyHeader } from "./CompanyHeader";
import { Error } from "@/shared/components/feedback/Error";
import { CompanyProfileSkeleton } from "./CompanyProfileSkeleton";
import {
    CompanyAboutCard,
    CompanyPositionsSection,
} from "./company-profile";

export function CompanyProfilePage({ slug }) {
    const { company, loading, error } = useCompanyDetail(slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <CompanyProfileSkeleton />;
    if (error) return <Error message={error} />;
    if (!company) return <Error message="الشركة غير موجودة" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <CompanyHeader company={company} />

            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    <CompanyAboutCard company={company} />

                    <CompanyPositionsSection
                        positions={company.openPositions || []}
                        companyName={company.name}
                    />
                </div>
            </div>
        </div>
    );
}
