/**
 * Legacy email service — delegates to the new modular email system.
 * Kept for backward compatibility with existing invitation email calls.
 */

import { sendEmail } from "./email/sendEmail";
import {
    buildInvitationEmailHtml,
    buildInvitationEmailText,
} from "./emailTemplates";

export async function sendInvitationEmail({
    recipientEmail,
    organizationName,
    inviterName,
    roleName,
}) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const signUpUrl = `${appUrl}/sign-up`;

    const templateParams = {
        organizationName,
        inviterName,
        roleName,
        signUpUrl,
    };

    try {
        return await sendEmail({
            to: recipientEmail,
            subject: `You're invited to join ${organizationName}`,
            html: buildInvitationEmailHtml(templateParams),
            text: buildInvitationEmailText(templateParams),
        });
    } catch (error) {
        console.error(
            "[EmailService] Unexpected error sending invitation email:",
            error.message,
        );
        return false;
    }
}
