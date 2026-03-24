"use client";

import { Bookmark } from "lucide-react";
import { ProjectCardTags } from "./ProjectCardTags";
import { ProjectCardFooter } from "./ProjectCardFooter";

export function ProjectCard({ project, viewMode = "list" }) {
  // Grid view card (more compact)
  if (viewMode === "grid") {
    return (
      <div className="block h-full">
        <div className="bg-white border border-gray-200 rounded-lg p-5 h-full transition-all hover:shadow-md hover:border-gray-300">
          {/* Title + Client + Bookmark */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-base md:text-lg text-gray-900 leading-tight mb-0.5">
                {project.title}
              </h3>
              {project.clientName && (
                <span className="text-sm text-[#5286A5] font-medium block mb-2">
                  {project.clientName}
                </span>
              )}
            </div>
            <button
              className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
              onClick={(e) => e.preventDefault()}
              aria-label="حفظ المشروع"
            >
              <Bookmark size={18} />
            </button>
          </div>

          {/* Description */}
          {project.shortDescription && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-3">
              {project.shortDescription}
            </p>
          )}

          {/* Tags */}
          <div className="mb-4">
            <ProjectCardTags
              budget={project.budget}
              budgetMin={
                project.budgetMin ?? project.minBudget ?? project.priceMin
              }
              budgetMax={
                project.budgetMax ?? project.maxBudget ?? project.priceMax
              }
              currency={project.currency}
              duration={project.duration}
              offersCount={
                project.offersCount ??
                project.offerCount ??
                (Array.isArray(project.offers)
                  ? project.offers.length
                  : project.offers)
              }
              compact
            />
          </div>

          {/* Footer */}
          <ProjectCardFooter
            projectId={project._id}
            publishedAt={project.publishedAt}
            compact
          />
        </div>
      </div>
    );
  }

  // List view card (default)
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 transition-all">
      {/* Top section: Info + Bookmark */}
      <div className="flex items-start gap-4">
        {/* Project Info */}
        <div className="flex-1 min-w-0">
          {/* Title + Client */}
          <div className="mb-1">
            <h3 className="text-base md:text-lg text-gray-900 leading-tight">
              {project.title}
            </h3>
            {project.clientName && (
              <span className="text-sm text-[#5286A5] font-medium">
                {project.clientName}
              </span>
            )}
          </div>

          {/* Description */}
          {project.shortDescription && (
            <p className="text-sm text-gray-500 line-clamp-1 mb-3">
              {project.shortDescription}
            </p>
          )}

          {/* Tags row */}
          <ProjectCardTags
            budget={project.budget}
            budgetMin={
              project.budgetMin ?? project.minBudget ?? project.priceMin
            }
            budgetMax={
              project.budgetMax ?? project.maxBudget ?? project.priceMax
            }
            currency={project.currency}
            duration={project.duration}
            offersCount={
              project.offersCount ??
              project.offerCount ??
              (Array.isArray(project.offers)
                ? project.offers.length
                : project.offers)
            }
          />
        </div>

        {/* Bookmark icon */}
        <button
          className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-1 cursor-pointer"
          onClick={(e) => e.preventDefault()}
          aria-label="حفظ المشروع"
        >
          <Bookmark size={25} />
        </button>
      </div>

      {/* Footer: Date + View button */}
      <ProjectCardFooter
        projectId={project._id}
        publishedAt={project.publishedAt}
      />
    </div>
  );
}
