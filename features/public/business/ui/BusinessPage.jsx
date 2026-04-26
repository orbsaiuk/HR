import { BusinessCTASection } from "./components/BusinessCTASection";
import { EmploymentSolutionsSection } from "./components/EmploymentSolutionsSection";
import { HeroSection } from "./components/HeroSection";
import { StepsSection } from "./components/StepsSection";
import { TeamBuildingSection } from "./components/TeamBuildingSection";

export function BusinessPage() {
    return (
        <>
            <HeroSection />
            <StepsSection />
            <TeamBuildingSection />
            <EmploymentSolutionsSection />
            <BusinessCTASection />
        </>)
}
