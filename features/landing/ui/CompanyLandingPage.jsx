"use client";

import { CompanyHeroSection } from "./company/CompanyHeroSection";
import { BestResumesSection } from "./company/BestResumesSection";
import { TopFreelancersSection } from "./company/TopFreelancersSection";
import { TrustedCompaniesSection } from "./company/TrustedCompaniesSection";
import { PlatformNewsSection } from "./company/PlatformNewsSection";
import { CompanyCTASection } from "./company/CompanyCTASection";
import { Footer } from "./Footer";

export function CompanyLandingPage() {
    return (
        <>
            <CompanyHeroSection />
            <BestResumesSection />
            <TopFreelancersSection />
            <TrustedCompaniesSection />
            <PlatformNewsSection />
            <CompanyCTASection />
            <Footer />
        </>
    );
}
