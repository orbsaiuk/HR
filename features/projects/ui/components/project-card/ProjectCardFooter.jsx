"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Formats a date to Arabic relative time or formatted date
 */
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  if (diffDays < 30) return `منذ ${Math.floor(diffDays / 7)} أسابيع`;
  if (diffDays < 365) return `منذ ${Math.floor(diffDays / 30)} أشهر`;

  // Fallback to formatted date
  return date.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
  });
}

/**
 * Footer component for ProjectCard with date and CTA
 */
export function ProjectCardFooter({ projectId, publishedAt, compact = false }) {
  const dateText = formatDate(publishedAt);
  const textSize = compact ? "text-xs" : "text-sm";
  const btnSize = compact ? "px-4 text-xs" : "px-6 text-sm";

  return (
    <div className={`flex items-center justify-between ${compact ? "pt-3" : "mt-4 pt-3"} border-t border-gray-100`}>
      {/* Date */}
      {dateText && (
        <span className={`${textSize} text-gray-400`}>{dateText}</span>
      )}

      {/* CTA Button */}
      <Button
        size="sm"
        className={`bg-[#5286A5] hover:bg-[#5286A5]/90 text-white rounded-md ${btnSize} font-medium`}
        asChild
      >
        <Link href={`/projects/${projectId}`}>عرض المشروع</Link>
      </Button>
    </div>
  );
}
