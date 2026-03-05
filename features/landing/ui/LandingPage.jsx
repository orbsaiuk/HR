"use client";

import { HeroSection } from "./HeroSection";
import { AboutSection } from "./AboutSection";
import { FreelanceSection } from "./FreelanceSection";
import { CategoriesSection } from "./CategoriesSection";
import { HowSection } from "./HowSection";
import { WhySection } from "./WhySection";
import { CTASection } from "./CTASection";
import { Footer } from "./Footer";

export function LandingPage() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <CategoriesSection />
            <FreelanceSection />
            <HowSection />
            <WhySection />
            <CTASection />
            <Footer />
        </>
    );
}
