"use client"

import { FreelancerCategoriesSection } from "./freelancer/FreelancerCategoriesSection";
import { FreelancerHeroSection } from "./freelancer/FreelancerHeroSection";
import { FreelancerJobsSection } from "./freelancer/FreelancerJobsSection";
import { NewsSection } from "./shared/NewsSection";
import { FreelancerCTASection } from "./freelancer/FreelancerCTASection";

export function FreelancerLandingPage() {
    return (
        <>
            <FreelancerHeroSection />
            <FreelancerCategoriesSection />
            <FreelancerJobsSection />
            <NewsSection />
            <FreelancerCTASection />
        </>
    );
}

