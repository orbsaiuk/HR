/**
 * Recruitment email sender functions.
 * Each function builds the appropriate template and sends via SMTP.
 * All functions follow the fire-and-forget pattern — they never throw.
 */

import { sendEmail } from "./sendEmail";
import {
    buildNewApplicationEmailHtml,
    buildNewApplicationEmailText,
    buildApplicationStatusEmailHtml,
    buildApplicationStatusEmailText,
    getStatusLabel,
} from "./recruitmentTemplates";


export async function sendNewApplicationEmail({
    recipientEmail,
    applicantName,
    positionTitle,
    organizationName,
    applicationUrl,
}) {
    const templateParams = {
        applicantName,
        positionTitle,
        organizationName,
        applicationUrl,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `New application for ${positionTitle}`,
            html: buildNewApplicationEmailHtml(templateParams),
            text: buildNewApplicationEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[RecruitmentEmail] Failed to send new application email:",
            error.message,
        );
        return false;
    }
}


export async function sendApplicationStatusEmail({
    recipientEmail,
    applicantName,
    positionTitle,
    organizationName,
    newStatus,
    rejectionReason,
    applicationsUrl,
}) {
    const statusLabel = getStatusLabel(newStatus);

    const templateParams = {
        applicantName,
        positionTitle,
        organizationName,
        newStatus,
        rejectionReason,
        applicationsUrl,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `Application Update: ${positionTitle} — ${statusLabel}`,
            html: buildApplicationStatusEmailHtml(templateParams),
            text: buildApplicationStatusEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[RecruitmentEmail] Failed to send application status email:",
            error.message,
        );
        return false;
    }
}
