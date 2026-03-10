/**
 * Shared utilities and constants for PositionCard components.
 */

/** Strip HTML tags for plain-text preview */
export function stripHtml(html) {
    if (!html) return "";
    return html
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export const TYPE_LABELS = {
    "full-time": "دوام كامل",
    "part-time": "دوام جزئي",
    contract: "تعاقد",
    internship: "تدريب",
    remote: "عن بعد",
};

export const LEVEL_LABELS = {
    entry: "مبتدئ",
    mid: "مستوى متوسط",
    senior: "مستوى متقدم",
    manager: "مستوى إداري",
};

export function formatSalary(min, max, currency = "USD") {
    const fmt = (v) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(v);

    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `من ${fmt(min)}`;
    if (max) return `حتى ${fmt(max)}`;
    return null;
}

/**
 * Returns a human-readable Arabic relative time string.
 */
export function timeAgo(dateStr) {
    if (!dateStr) return null;
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    if (diffMs < 0) return null;

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMs / 3600000);
    const days = Math.floor(diffMs / 86400000);

    if (minutes < 1) return "الآن";
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24)
        return `منذ ${hours === 1 ? "ساعة" : hours === 2 ? "ساعتين" : `${hours} ساعات`}`;
    if (days === 1) return "منذ يوم";
    if (days === 2) return "منذ يومين";
    if (days < 7) return `منذ ${days} أيام`;
    if (days < 30) return `منذ ${Math.floor(days / 7)} أسبوع`;
    return `منذ ${Math.floor(days / 30)} شهر`;
}
