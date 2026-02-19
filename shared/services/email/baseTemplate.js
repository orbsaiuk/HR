/**
 * Shared base email template components.
 * Provides consistent header, footer, and layout for all email templates.
 */

export function escapeHtml(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


export function wrapInBaseLayout(title, bodyContent) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
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
              ${bodyContent}
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

export function buildCtaButton(url, label) {
    return `
<div style="text-align: center; margin-bottom: 32px;">
  <a href="${escapeHtml(url)}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 8px;">
    ${escapeHtml(label)} &rarr;
  </a>
</div>`;
}

export function buildBadge(text, colors = { bg: "#eff6ff", text: "#2563eb" }) {
    return `
<div style="text-align: center; margin-bottom: 32px;">
  <span style="display: inline-block; background-color: ${colors.bg}; color: ${colors.text}; font-size: 13px; font-weight: 600; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
    ${escapeHtml(text)}
  </span>
</div>`;
}

export function buildDivider() {
    return `<hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />`;
}


export function buildSecondaryText(text) {
    return `
<p style="margin: 0; color: #a1a1aa; font-size: 13px; line-height: 1.5; text-align: center;">
  ${escapeHtml(text)}
</p>`;
}
