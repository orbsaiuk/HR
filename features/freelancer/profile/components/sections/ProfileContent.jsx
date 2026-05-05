"use client";

import { ProfileAboutSection } from "./ProfileAboutSection";
import { ProfileSkillsSection } from "./ProfileSkillsSection";
import { ProfileServicesSection } from "./ProfileServicesSection";
import { ProfilePortfolioSection } from "./ProfilePortfolioSection";

export function ProfileContent({
  profile,
  onEdit,
  onAddService,
  onEditService,
  onDeleteService,
  onAddProject,
  onEditProject,
  onDeleteProject,
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <ProfileAboutSection profile={profile} onEdit={onEdit} />
      
      <ProfileSkillsSection profile={profile} onEdit={onEdit} />

      <ProfileServicesSection
        profile={profile}
        onAddService={onAddService}
        onEditService={onEditService}
        onDeleteService={onDeleteService}
      />

      <ProfilePortfolioSection
        profile={profile}
        onAddProject={onAddProject}
        onEditProject={onEditProject}
        onDeleteProject={onDeleteProject}
      />
    </div>
  );
}
