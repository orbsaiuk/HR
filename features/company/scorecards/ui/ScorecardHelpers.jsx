"use client";

import { Star } from "lucide-react";

const DEFAULT_CRITERIA = [
  { name: "المهارات التقنية", score: 0, comment: "" },
  { name: "التواصل", score: 0, comment: "" },
  { name: "الملاءمة الثقافية", score: 0, comment: "" },
  { name: "حل المشكلات", score: 0, comment: "" },
  { name: "مدى ارتباط الخبرة", score: 0, comment: "" },
];

const RECOMMENDATION_OPTIONS = [
  {
    value: "strong-hire",
    label: "توظيف قوي",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    value: "hire",
    label: "توظيف",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    value: "no-hire",
    label: "عدم توظيف",
    color: "bg-orange-100 text-orange-800 border-orange-300",
  },
  {
    value: "strong-no-hire",
    label: "عدم توظيف نهائي",
    color: "bg-red-100 text-red-800 border-red-300",
  },
];

export { DEFAULT_CRITERIA, RECOMMENDATION_OPTIONS };

export function StarRating({ value, onChange, size = 16, readonly = false }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"} transition-transform`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        </button>
      ))}
    </span>
  );
}

export function RecommendationBadge({ value }) {
  const option = RECOMMENDATION_OPTIONS.find((o) => o.value === value);
  if (!option) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${option.color}`}
    >
      {option.label}
    </span>
  );
}
