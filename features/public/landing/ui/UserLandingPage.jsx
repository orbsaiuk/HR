"use client";

import { UserHeroSection } from "./user/UserHeroSection";
import { UserWhySection } from "./user/UserWhySection";
import { UserJobsSection } from "./user/UserJobsSection";
import { FreelanceCTASection } from "./user/FreelanceCTASection";
import { TopFreelancersSection } from "./company/TopFreelancersSection";
import { NewsSection } from "@/shared/components/sections/NewsSection";
import { UserCTASection } from "./user/UserCTASection";

export function UserLandingPage() {
  return (
    <>
      <UserHeroSection />
      <UserWhySection />
      <UserJobsSection />
      <FreelanceCTASection />
      <TopFreelancersSection />
      <NewsSection />
      <UserCTASection />
    </>
  );
}
