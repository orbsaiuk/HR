"use client";

import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock } from "lucide-react";

/**
 * Formats duration for display
 */
function formatDuration(duration) {
  if (!duration || !duration.value) return null;
  const { value } = duration;
  if (value === 1) return "شهر واحد";
  if (value === 2) return "شهران";
  if (value <= 10) return `${value} أشهر`;
  return `${value} شهر`;
}

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatBudget(budget, budgetMin, budgetMax, currency = "USD") {
  if (budgetMin || budgetMax) {
    if (budgetMin && budgetMax) {
      return `${formatMoney(budgetMin, currency)} - ${formatMoney(budgetMax, currency)}`;
    }
    if (budgetMin) return `من ${formatMoney(budgetMin, currency)}`;
    if (budgetMax) return `حتى ${formatMoney(budgetMax, currency)}`;
  }

  if (budget === null || budget === undefined || budget === "") return null;

  if (typeof budget === "string") return budget;
  if (typeof budget === "number") return formatMoney(budget, currency);

  if (typeof budget === "object") {
    const min = budget.min ?? budget.minAmount ?? budget.from;
    const max = budget.max ?? budget.maxAmount ?? budget.to;
    const amount = budget.amount ?? budget.value;
    const budgetCurrency = budget.currency || budget.currencyCode || currency;

    if (min !== undefined && max !== undefined) {
      return `${formatMoney(Number(min), budgetCurrency)} - ${formatMoney(Number(max), budgetCurrency)}`;
    }

    if (amount !== undefined) {
      return formatMoney(Number(amount), budgetCurrency);
    }
  }

  return null;
}

/**
 * Displays project metadata similar to Careers page style
 */
export function ProjectCardTags({
  budget,
  budgetMin,
  budgetMax,
  currency = "USD",
  duration,
  offersCount,
  compact = false,
}) {
  const iconSize = compact ? 12 : 14;
  const textClass = compact ? "text-xs" : "text-sm";

  const durationText = formatDuration(duration);
  const budgetText =
    formatBudget(budget, budgetMin, budgetMax, currency) ||
    "الميزانية غير محددة";
  const offersNumber = Number(offersCount);
  const offersText = Number.isFinite(offersNumber)
    ? `${offersNumber.toLocaleString()} عروض`
    : "0 عروض";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${textClass} text-gray-600`}
    >
      {/* Budget as Badge */}
      {budgetText && (
        <Badge
          variant="outline"
          className={`rounded-full border-gray-300 text-gray-700 font-normal ${
            compact ? "px-2.5 py-0.5 text-xs" : "px-3 py-0.5"
          }`}
        >
          {budgetText}
        </Badge>
      )}

      {/* Duration with icon */}
      {durationText && (
        <span className="flex items-center gap-1 text-gray-500">
          <Clock size={iconSize} className="text-gray-400" />
          {durationText}
        </span>
      )}

      {/* Number of offers with icon */}
      {offersText && (
        <span className="flex items-center gap-1 text-gray-500">
          <Briefcase size={iconSize} className="text-gray-400" />
          {offersText}
        </span>
      )}
    </div>
  );
}
