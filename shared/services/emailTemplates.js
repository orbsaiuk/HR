/**
 * Email template builders for the application.
 * All templates use inline CSS for maximum email client compatibility.
 */

export function buildInvitationEmailHtml({
    organizationName,
    inviterName,
    roleName,
    signUpUrl,
}) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're Invited to Join ${escapeHtml(organizationName)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: #18181b; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: -0.025em;">
                HireHub
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <!-- Invitation Badge -->
              <div style="text-align: center; margin-bottom: 32px;">
                <span style="display: inline-block; background-color: #eff6ff; color: #2563eb; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
                  Team Invitation
                </span>
              </div>

              <!-- Main Content -->
              <h2 style="margin: 0 0 16px; color: #18181b; font-size: 22px; font-weight: 700; text-align: center; line-height: 1.3;">
                You've been invited to join<br />
                <span style="color: #2563eb;">${escapeHtml(organizationName)}</span>
              </h2>

              <p style="margin: 0 0 24px; color: #52525b; font-size: 15px; line-height: 1.6; text-align: center;">
                <strong style="color: #18181b;">${escapeHtml(inviterName)}</strong> has invited you to join their team as a <strong style="color: #18181b;">${escapeHtml(roleName)}</strong>.
              </p>

              <p style="margin: 0 0 32px; color: #71717a; font-size: 14px; line-height: 1.6; text-align: center;">
                Create your account to get started. Once you sign up with this email address, you'll automatically be added to the team.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="${escapeHtml(signUpUrl)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 8px; transition: background-color 0.2s;">
                  Get Started &rarr;
                </a>
              </div>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />

              <!-- Secondary Info -->
              <p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center;">
                If you did not expect this invitation, you can safely ignore this email. No account will be created unless you sign up.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 40px; border-top: 1px solid #f4f4f5;">
              <p style="margin: 0; color: #a1a1aa; font-size: 12px; text-align: center; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} HireHub. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function buildInvitationEmailText({
    organizationName,
    inviterName,
    roleName,
    signUpUrl,
}) {
    return [
        `You've been invited to join ${organizationName}`,
        "",
        `${inviterName} has invited you to join their team as a ${roleName}.`,
        "",
        "Create your account to get started. Once you sign up with this email address, you'll automatically be added to the team.",
        "",
        `Sign up here: ${signUpUrl}`,
        "",
        "---",
        "If you did not expect this invitation, you can safely ignore this email.",
        "",
        `© ${new Date().getFullYear()} HireHub`,
    ].join("\n");
}

function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
