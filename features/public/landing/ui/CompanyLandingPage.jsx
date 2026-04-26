"use client";

import { CompanyHeroSection } from "./company/CompanyHeroSection";
import { BestResumesSection } from "./company/BestResumesSection";
import { TopFreelancersSection } from "./company/TopFreelancersSection";
import { TrustedCompaniesSection } from "./company/TrustedCompaniesSection";
import { NewsSection } from "@/shared/components/sections/NewsSection";
import { CompanyCTASection } from "./company/CompanyCTASection";

export function CompanyLandingPage() {
    return (
        <>
            <CompanyHeroSection />
            <BestResumesSection />
            <TopFreelancersSection />
            <TrustedCompaniesSection />
            <NewsSection />
            <CompanyCTASection />
        </>
    );
}
