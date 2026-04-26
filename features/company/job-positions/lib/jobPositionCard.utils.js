import { TYPE_LABELS } from "./jobPositionCard.constants";

export function formatNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString("en-US");
}

export function formatSalary(position) {
  if (position?.salary) return position.salary;

  const min = position?.salaryMin;
  const max = position?.salaryMax;
  const currency = position?.currency || "USD";

  if (!min && !max) return "الراتب حسب الخبرة";

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`;
  }

  if (min) {
    return `${formatNumber(min)}+ ${currency}`;
  }

  return `${formatNumber(max)} ${currency}`;
}

export function getDaysRemaining(deadline) {
  if (!deadline) return null;

  const now = new Date();
  const end = new Date(deadline);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((end.getTime() - now.getTime()) / msPerDay);

  return Math.max(0, diff);
}

export function getTimelineProgress(createdAt, deadline) {
  if (!createdAt || !deadline) return 100;

  const start = new Date(createdAt).getTime();
  const end = new Date(deadline).getTime();
  const now = Date.now();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 100;

  const total = end - start;
  const remaining = Math.max(0, end - now);
  const value = Math.round((remaining / total) * 100);

  return Math.min(100, Math.max(0, value));
}

export function getDefaultTags(position, levelLabel) {
  const firstTag = position?.department || position?.industryTag || "عام";
  const secondTag =
    position?.workType || TYPE_LABELS[position?.type] || "نوع العمل";
  const thirdTag = levelLabel;

  return [firstTag, secondTag, thirdTag].filter(Boolean).slice(0, 3);
}

export function resolvePositionId(position) {
  return position?._id || position?.id || null;
}
