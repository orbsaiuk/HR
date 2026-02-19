/**
 * Application notification service.
 * Handles determining recipients and sending email notifications
 * for application-related events.
 */

import {
    sendNewApplicationEmail,
    sendApplicationStatusEmail,
} from "@/shared/services/email";
import { getOrganizationRoles } from "@/features/roles/services/rolesService";
import { getAllTeamMembers } from "@/features/team-member-management/services/teamMemberManagementService";
import { getApplicationById } from "./applicationService";
import { PERMISSIONS } from "@/shared/lib/permissions";


async function getTeamMembersWithPermission(orgId, permission) {
    const [teamMembers, roles] = await Promise.all([
        getAllTeamMembers(orgId),
        getOrganizationRoles(orgId),
    ]);

    // Build a set of roleKeys that have the required permission
    const roleKeysWithPermission = new Set(
        roles
            .filter((role) => role.permissions?.includes(permission))
            .map((role) => role._key),
    );

    // Filter team members whose roleKey is in the set and who have an email
    return teamMembers
        .filter(
            (tm) =>
                roleKeysWithPermission.has(tm.roleKey) &&
                tm.user?.email,
        )
        .map((tm) => ({
            name: tm.user.name || "",
            email: tm.user.email,
        }));
}

export async function notifyNewApplication({
    orgId,
    applicantName,
    positionTitle,
    organizationName,
    applicationId,
}) {
    try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const applicationUrl = `${appUrl}/dashboard/positions`;

        const recipients = await getTeamMembersWithPermission(
            orgId,
            PERMISSIONS.MANAGE_APPLICATIONS,
        );

        if (recipients.length === 0) {
            console.log(
                "[ApplicationNotification] No team members with MANAGE_APPLICATIONS permission to notify",
            );
            return;
        }

        // Send emails in parallel (fire-and-forget per recipient)
        const emailPromises = recipients.map((recipient) =>
            sendNewApplicationEmail({
                recipientEmail: recipient.email,
                applicantName,
                positionTitle,
                organizationName,
                applicationUrl,
            }).catch((err) => {
                console.error(
                    `[ApplicationNotification] Failed to notify ${recipient.email}:`,
                    err.message,
                );
            }),
        );

        await Promise.allSettled(emailPromises);

        console.log(
            `[ApplicationNotification] Notified ${recipients.length} team member(s) about new application`,
        );
    } catch (error) {
        console.error(
            "[ApplicationNotification] Failed to send new application notifications:",
            error.message,
        );
    }
}


export async function notifyApplicationStatusChange({
    applicationId,
    newStatus,
    rejectionReason,
}) {
    try {
        const application = await getApplicationById(applicationId);

        if (!application) {
            console.warn(
                "[ApplicationNotification] Application not found for status notification:",
                applicationId,
            );
            return;
        }

        const applicantEmail = application.applicant?.email;
        const applicantName = application.applicant?.name || "Applicant";
        const positionTitle = application.jobPosition?.title || "Position";

        if (!applicantEmail) {
            console.warn(
                "[ApplicationNotification] No applicant email found for application:",
                applicationId,
            );
            return;
        }

        // Resolve organization name from the job position
        const organizationName = application.jobPosition?.organizationName || "the company";

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const applicationsUrl = `${appUrl}/my-applications`;

        await sendApplicationStatusEmail({
            recipientEmail: applicantEmail,
            applicantName,
            positionTitle,
            organizationName,
            newStatus,
            rejectionReason,
            applicationsUrl,
        });

        console.log(
            `[ApplicationNotification] Notified applicant ${applicantEmail} about status change to ${newStatus}`,
        );
    } catch (error) {
        console.error(
            "[ApplicationNotification] Failed to send status change notification:",
            error.message,
        );
    }
}
