/**
 * Email templates for organization request notifications.
 * Covers: request submitted, request approved, request rejected.
 */

import {
  escapeHtml,
  wrapInBaseLayout,
  buildCtaButton,
  buildBadge,
  buildDivider,
  buildSecondaryText,
} from "./baseTemplate";

// ─── Organization Request Submitted (confirmation to requester) ─────────────

export function buildOrgRequestSubmittedEmailHtml({
  requesterName,
  organizationName,
  requestStatusUrl,
}) {
  const bodyContent = `
${buildBadge("Request Received", { bg: "#eff6ff", text: "#2563eb" })}

<h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
  Your request has been submitted!
</h2>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Hi <strong style="color: #18181b;">${escapeHtml(requesterName)}</strong>,
</p>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  We've received your request to register <strong style="color: #2563eb;">${escapeHtml(organizationName)}</strong> on HireHub. Our team will review your submission and get back to you soon.
</p>

<p style="margin: 0 0 32px; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
  You'll receive an email notification once your request has been reviewed. You can also check the status of your request at any time.
</p>

${buildCtaButton(requestStatusUrl, "Check Request Status")}

${buildDivider()}

${buildSecondaryText("You're receiving this because you submitted an organization registration request on HireHub.")}`;

  return wrapInBaseLayout(
    `Request Received — ${organizationName}`,
    bodyContent,
  );
}

export function buildOrgRequestSubmittedEmailText({
  requesterName,
  organizationName,
  requestStatusUrl,
}) {
  return [
    `Request Received — ${organizationName}`,
    "",
    `Hi ${requesterName},`,
    "",
    `We've received your request to register ${organizationName} on HireHub. Our team will review your submission and get back to you soon.`,
    "",
    "You'll receive an email notification once your request has been reviewed. You can also check the status of your request at any time.",
    "",
    `Check request status: ${requestStatusUrl}`,
    "",
    "---",
    "You're receiving this because you submitted an organization registration request on HireHub.",
    "",
    `© ${new Date().getFullYear()} HireHub`,
  ].join("\n");
}

// ─── Organization Request Approved (sent to requester) ──────────────────────

export function buildOrgRequestApprovedEmailHtml({
  requesterName,
  organizationName,
  dashboardUrl,
}) {
  const bodyContent = `
${buildBadge("Approved", { bg: "#ecfdf5", text: "#059669" })}

<h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
  Your organization has been approved!
</h2>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Hi <strong style="color: #18181b;">${escapeHtml(requesterName)}</strong>,
</p>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Great news! Your request to register <strong style="color: #2563eb;">${escapeHtml(organizationName)}</strong> has been approved. You can now access your organization dashboard and start setting up your team.
</p>

<p style="margin: 0 0 32px; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
  You've been added as an admin. Invite team members, create job positions, and manage your hiring pipeline.
</p>

${buildCtaButton(dashboardUrl, "Go to Dashboard")}

${buildDivider()}

${buildSecondaryText("You're receiving this because you submitted an organization registration request on HireHub.")}`;

  return wrapInBaseLayout(
    `Organization Approved — ${organizationName}`,
    bodyContent,
  );
}

export function buildOrgRequestApprovedEmailText({
  requesterName,
  organizationName,
  dashboardUrl,
}) {
  return [
    `Organization Approved — ${organizationName}`,
    "",
    `Hi ${requesterName},`,
    "",
    `Great news! Your request to register ${organizationName} has been approved.`,
    "You can now access your organization dashboard and start setting up your team.",
    "",
    "You've been added as an admin. Invite team members, create job positions, and manage your hiring pipeline.",
    "",
    `Go to dashboard: ${dashboardUrl}`,
    "",
    "---",
    "You're receiving this because you submitted an organization registration request on HireHub.",
    "",
    `© ${new Date().getFullYear()} HireHub`,
  ].join("\n");
}

// ─── Organization Request Rejected (sent to requester) ──────────────────────

export function buildOrgRequestRejectedEmailHtml({
  requesterName,
  organizationName,
  reason,
}) {
  const reasonBlock = reason
    ? `
<div style="background-color: #fef2f2; border-radius: 8px; padding: 16px 20px; margin: 0 0 24px;">
  <p style="margin: 0 0 4px; color: #991b1b; font-size: 13px; font-weight: 600;">Reason</p>
  <p style="margin: 0; color: #7f1d1d; font-size: 14px; line-height: 1.5;">${escapeHtml(reason)}</p>
</div>`
    : "";

  const bodyContent = `
${buildBadge("Rejected", { bg: "#fef2f2", text: "#dc2626" })}

<h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
  Organization request not approved
</h2>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Hi <strong style="color: #18181b;">${escapeHtml(requesterName)}</strong>,
</p>

<p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
  Unfortunately, your request to register <strong style="color: #18181b;">${escapeHtml(organizationName)}</strong> has not been approved at this time.
</p>

${reasonBlock}

<p style="margin: 0 0 32px; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
  If you believe this was a mistake or would like to submit a new request with updated information, you're welcome to try again.
</p>

${buildDivider()}

${buildSecondaryText("You're receiving this because you submitted an organization registration request on HireHub.")}`;

  return wrapInBaseLayout(
    `Organization Request Update — ${organizationName}`,
    bodyContent,
  );
}

export function buildOrgRequestRejectedEmailText({
  requesterName,
  organizationName,
  reason,
}) {
  const lines = [
    `Organization Request Update — ${organizationName}`,
    "",
    `Hi ${requesterName},`,
    "",
    `Unfortunately, your request to register ${organizationName} has not been approved at this time.`,
    "",
  ];

  if (reason) {
    lines.push(`Reason: ${reason}`, "");
  }

  lines.push(
    "If you believe this was a mistake or would like to submit a new request with updated information, you're welcome to try again.",
    "",
    "---",
    "You're receiving this because you submitted an organization registration request on HireHub.",
    "",
    `© ${new Date().getFullYear()} HireHub`,
  );

  return lines.join("\n");
}

