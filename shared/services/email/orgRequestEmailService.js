/**
 * Organization request email sender functions.
 * Each function builds the appropriate template and sends via SMTP.
 * All functions follow the fire-and-forget pattern — they never throw.
 */

import { sendEmail } from "./sendEmail";
import {
    buildOrgRequestSubmittedEmailHtml,
    buildOrgRequestSubmittedEmailText,
    buildOrgRequestApprovedEmailHtml,
    buildOrgRequestApprovedEmailText,
    buildOrgRequestRejectedEmailHtml,
    buildOrgRequestRejectedEmailText,
} from "./orgRequestTemplates";


export async function sendOrgRequestSubmittedEmail({
    recipientEmail,
    requesterName,
    organizationName,
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const requestStatusUrl = `${appUrl}/user/organization-requests`;

    const templateParams = {
        requesterName,
        organizationName,
        requestStatusUrl,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `Request received — ${organizationName}`,
            html: buildOrgRequestSubmittedEmailHtml(templateParams),
            text: buildOrgRequestSubmittedEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[OrgRequestEmail] Failed to send submission confirmation email:",
            error.message,
        );
        return false;
    }
}


export async function sendOrgRequestApprovedEmail({
    recipientEmail,
    requesterName,
    organizationName,
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const dashboardUrl = `${appUrl}/dashboard`;

    const templateParams = {
        requesterName,
        organizationName,
        dashboardUrl,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `Your organization "${organizationName}" has been approved!`,
            html: buildOrgRequestApprovedEmailHtml(templateParams),
            text: buildOrgRequestApprovedEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[OrgRequestEmail] Failed to send approval email:",
            error.message,
        );
        return false;
    }
}

export async function sendOrgRequestRejectedEmail({
    recipientEmail,
    requesterName,
    organizationName,
    reason,
}) {
    const templateParams = {
        requesterName,
        organizationName,
        reason,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `Organization request update — ${organizationName}`,
            html: buildOrgRequestRejectedEmailHtml(templateParams),
            text: buildOrgRequestRejectedEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[OrgRequestEmail] Failed to send rejection email:",
            error.message,
        );
        return false;
    }
}
