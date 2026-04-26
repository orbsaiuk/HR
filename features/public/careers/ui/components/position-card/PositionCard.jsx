"use client";

import { Bookmark } from "lucide-react";
import { urlFor } from "@/shared/lib/sanityImage";
import { stripHtml, formatSalary, timeAgo } from "./positionCardUtils";
import { PositionCardTags } from "./PositionCardTags";
import { PositionCardFooter } from "./PositionCardFooter";
import { GridPositionCard } from "./GridPositionCard";

export function PositionCard({ position, viewMode = "list" }) {
  const salary = formatSalary(
    position.salaryMin,
    position.salaryMax,
    position.currency,
  );

  const isClosed = position.status === "closed";

  const orgLogoUrl = position.organizationLogo
    ? urlFor(position.organizationLogo).width(56).height(56).url()
    : null;

  const postedTime = timeAgo(position.createdAt || position.deadline);

  // Grid view card
  if (viewMode === "grid") {
    return (
      <GridPositionCard
        position={position}
        salary={salary}
        isClosed={isClosed}
        orgLogoUrl={orgLogoUrl}
        postedTime={postedTime}
      />
    );
  }

  // List view card (default)
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-5 transition-all ${!isClosed ? "" : "opacity-70"}`}
    >
      {/* Top section: Info + Bookmark */}
      <div className="flex items-start gap-4">
        {/* Job Info */}
        <div className="flex-1 min-w-0">
          {/* Title + Company */}
          <div className="mb-1">
            <h3 className="text-base md:text-lg text-gray-900 leading-tight">
              {position.title}
            </h3>
            {position.organizationName && (
              <span className="text-sm text-[#5286A5] font-medium">
                {position.organizationName}
              </span>
            )}
          </div>

          {/* Description */}
          {position.description && (
            <p className="text-sm text-gray-500 line-clamp-1 mb-3">
              {stripHtml(position.description)}
            </p>
          )}

          {/* Tags row */}
          <PositionCardTags
            type={position.type}
            location={position.location}
            salary={salary}
            seniority={position.seniority || position.level}
          />
        </div>

        {/* Bookmark icon */}
        <button
          className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors mt-1 cursor-pointer"
          onClick={(e) => e.preventDefault()}
          aria-label="حفظ الوظيفة"
        >
          <Bookmark size={25} />
        </button>
      </div>

      {/* Footer: Time + Apply button */}
      <PositionCardFooter
        positionId={position._id}
        postedTime={postedTime}
        isClosed={isClosed}
      />
    </div>
  );
}
