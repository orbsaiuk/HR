"use client";

import { Bookmark } from "lucide-react";
import { stripHtml } from "./positionCardUtils";
import { PositionCardTags } from "./PositionCardTags";
import { PositionCardFooter } from "./PositionCardFooter";

export function GridPositionCard({ position, salary, isClosed, postedTime }) {
  return (
    <div className="block h-full">
      <div
        className={`bg-white border border-gray-200 rounded-lg p-5 h-full transition-all ${!isClosed ? "hover:shadow-md hover:border-gray-300" : "opacity-70"}`}
      >
        {/* Title + Company + Bookmark */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-base md:text-lg text-gray-900 leading-tight mb-0.5">
              {position.title}
            </h3>
            {position.organizationName && (
              <span className="text-sm text-[#5286A5] font-medium block mb-2">
                {position.organizationName}
              </span>
            )}
          </div>
          <button
            className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
            onClick={(e) => e.preventDefault()}
            aria-label="حفظ الوظيفة"
          >
            <Bookmark size={18} />
          </button>
        </div>

        {/* Description */}
        {position.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-3">
            {stripHtml(position.description)}
          </p>
        )}

        {/* Tags */}
        <div className="mb-4">
          <PositionCardTags
            type={position.type}
            location={position.location}
            salary={salary}
            seniority={position.seniority || position.level}
            compact
          />
        </div>

        {/* Footer */}
        <PositionCardFooter
          positionId={position._id}
          postedTime={postedTime}
          isClosed={isClosed}
          compact
        />
      </div>
    </div>
  );
}
