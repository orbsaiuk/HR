import nodemailer from "nodemailer";

/**
 * Create a Nodemailer SMTP transporter using environment variables.
 * Returns null if SMTP is not configured.
 */
function createTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || "587", 10),
        secure: parseInt(SMTP_PORT || "587", 10) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });
}

export async function sendEmail({ to, subject, html, text }) {
    const transporter = createTransporter();

    if (!transporter) {
        console.warn(
            "[EmailService] SMTP not configured. Skipping email to:",
            to,
            "| Subject:",
            subject,
        );
        return false;
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    try {
        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
            text,
        });
        console.log("[EmailService] Email sent successfully:", info.messageId);
        return true;
    } catch (error) {
        console.error("[EmailService] Failed to send email:", error.message);
        return false;
    }
}
