"use client";

import { UserHeroSection } from "./user/UserHeroSection";
import { UserWhySection } from "./user/UserWhySection";
import { LatestJobsSection } from "./user/LatestJobsSection";
import { FreelanceCTASection } from "./user/FreelanceCTASection";
import { TopFreelancersSection } from "./company/TopFreelancersSection";
import { PlatformNewsSection } from "./company/PlatformNewsSection";
import { UserCTASection } from "./user/UserCTASection";

export function UserLandingPage() {
  return (
    <>
      <UserHeroSection />
      <UserWhySection />
      <LatestJobsSection />
      <FreelanceCTASection />
      <TopFreelancersSection />
      <PlatformNewsSection />
      <UserCTASection />
    </>
  );
}
