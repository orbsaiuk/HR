/**
 * Email templates for recruitment-related notifications.
 * Covers: new application received, application status changed.
 */

import {
    escapeHtml,
    wrapInBaseLayout,
    buildCtaButton,
    buildBadge,
    buildDivider,
    buildSecondaryText,
} from "./baseTemplate";

/**
 * Human-readable status labels and colors for application statuses.
 */
const STATUS_CONFIG = {
    new: { label: "Received", bg: "#eff6ff", text: "#2563eb" },
    screening: { label: "Under Review", bg: "#fefce8", text: "#ca8a04" },
    interview: { label: "Interview Stage", bg: "#f0fdf4", text: "#16a34a" },
    offered: { label: "Offer Extended", bg: "#faf5ff", text: "#9333ea" },
    hired: { label: "Hired", bg: "#ecfdf5", text: "#059669" },
    rejected: { label: "Not Selected", bg: "#fef2f2", text: "#dc2626" },
};


export function getStatusLabel(status) {
    return STATUS_CONFIG[status]?.label || status;
}


export function getStatusColors(status) {
    return STATUS_CONFIG[status] || { bg: "#f4f4f5", text: "#71717a" };
}

// ─── New Application Received (sent to team members) ────────────────────────

export function buildNewApplicationEmailHtml({
    applicantName,
    positionTitle,
    organizationName,
    applicationUrl,
}) {
    const bodyContent = `
${buildBadge("New Application")}

<h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
  New application for<br />
  <span style="color: #2563eb;">${escapeHtml(positionTitle)}</span>
</h2>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  <strong style="color: #18181b;">${escapeHtml(applicantName)}</strong> has applied for the <strong style="color: #18181b;">${escapeHtml(positionTitle)}</strong> position at ${escapeHtml(organizationName)}.
</p>

<p style="margin: 0 0 32px; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
  Review their application to move forward with the hiring process.
</p>

${buildCtaButton(applicationUrl, "View Application")}

${buildDivider()}

${buildSecondaryText("You're receiving this because you have application management permissions in your organization.")}`;

    return wrapInBaseLayout(
        `New Application — ${positionTitle}`,
        bodyContent,
    );
}

/**
 * Build plain text email for "New Application Received" notification.
 */
export function buildNewApplicationEmailText({
    applicantName,
    positionTitle,
    organizationName,
    applicationUrl,
}) {
    return [
        `New Application for ${positionTitle}`,
        "",
        `${applicantName} has applied for the ${positionTitle} position at ${organizationName}.`,
        "",
        "Review their application to move forward with the hiring process.",
        "",
        `View application: ${applicationUrl}`,
        "",
        "---",
        "You're receiving this because you have application management permissions in your organization.",
        "",
        `© ${new Date().getFullYear()} HireHub`,
    ].join("\n");
}

// ─── Application Status Changed (sent to applicant) ─────────────────────────

export function buildApplicationStatusEmailHtml({
    applicantName,
    positionTitle,
    organizationName,
    newStatus,
    rejectionReason,
    applicationsUrl,
}) {
    const statusLabel = getStatusLabel(newStatus);
    const statusColors = getStatusColors(newStatus);
    const isRejected = newStatus === "rejected";

    let statusMessage;
    switch (newStatus) {
        case "screening":
            statusMessage = "Your application is now being reviewed by the hiring team.";
            break;
        case "interview":
            statusMessage = "Congratulations! You've been selected for an interview. The team will reach out with scheduling details.";
            break;
        case "offered":
            statusMessage = "Great news! An offer has been extended to you. Please check your application for details.";
            break;
        case "hired":
            statusMessage = "Congratulations! You've been hired. Welcome to the team!";
            break;
        case "rejected":
            statusMessage = "After careful consideration, the team has decided to move forward with other candidates.";
            break;
        default:
            statusMessage = `Your application status has been updated to ${statusLabel}.`;
    }

    const rejectionBlock = isRejected && rejectionReason
        ? `
<div style="background-color: #fef2f2; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px;">
  <p style="margin: 0 0 4px; color: #991b1b; font-size: 13px; font-weight: 600;">Feedback</p>
  <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">${escapeHtml(rejectionReason)}</p>
</div>`
        : "";

    const bodyContent = `
${buildBadge(statusLabel, statusColors)}

<h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
  Application Update for<br />
  <span style="color: #2563eb;">${escapeHtml(positionTitle)}</span>
</h2>

<p style="margin: 0 0 8px; color: #71717a; font-size: 14px; text-align: center;">
  at ${escapeHtml(organizationName)}
</p>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Hi <strong style="color: #18181b;">${escapeHtml(applicantName)}</strong>,
</p>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  ${escapeHtml(statusMessage)}
</p>

${rejectionBlock}

${buildCtaButton(applicationsUrl, "View My Applications")}

${buildDivider()}

${buildSecondaryText("You're receiving this because you applied for a position on HireHub.")}`;

    return wrapInBaseLayout(
        `Application Update — ${positionTitle}`,
        bodyContent,
    );
}

/**
 * Build plain text email for "Application Status Changed" notification.
 */
export function buildApplicationStatusEmailText({
    applicantName,
    positionTitle,
    organizationName,
    newStatus,
    rejectionReason,
    applicationsUrl,
}) {
    const statusLabel = getStatusLabel(newStatus);

    const lines = [
        `Application Update — ${positionTitle}`,
        "",
        `Hi ${applicantName},`,
        "",
        `Your application for ${positionTitle} at ${organizationName} has been updated to: ${statusLabel}`,
        "",
    ];

    if (newStatus === "rejected" && rejectionReason) {
        lines.push(`Feedback: ${rejectionReason}`, "");
    }

    lines.push(
        `View your applications: ${applicationsUrl}`,
        "",
        "---",
        "You're receiving this because you applied for a position on HireHub.",
        "",
        `© ${new Date().getFullYear()} HireHub`,
    );

    return lines.join("\n");
}
