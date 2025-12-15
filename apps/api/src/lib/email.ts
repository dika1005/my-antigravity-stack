/**
 * Email Helper - Gmail SMTP with Nodemailer
 */
import nodemailer from "nodemailer";

// Create reusable transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/** Send email via Gmail SMTP */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || "Gallery App"}" <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });

        console.log("📧 Email sent:", info.messageId);
        return true;
    } catch (error) {
        console.error("❌ Email error:", error);
        return false;
    }
}

/** Send verification email */
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify?token=${token}`;
    return sendEmail({
        to: email,
        subject: "Verifikasi Email Anda - Gallery App",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Selamat Datang! 👋</h1>
                <p>Terima kasih telah mendaftar di Gallery App.</p>
                <p>Klik tombol di bawah untuk verifikasi email Anda:</p>
                <a href="${url}" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                    Verifikasi Email
                </a>
                <p style="color: #666; font-size: 14px;">Atau copy link ini: ${url}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Jika Anda tidak mendaftar, abaikan email ini.</p>
            </div>
        `,
    });
}

/** Send password reset email */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    return sendEmail({
        to: email,
        subject: "Reset Password - Gallery App",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Reset Password 🔐</h1>
                <p>Kami menerima permintaan untuk reset password akun Anda.</p>
                <p>Klik tombol di bawah untuk reset password:</p>
                <a href="${url}" style="display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
                    Reset Password
                </a>
                <p style="color: #666; font-size: 14px;">Atau copy link ini: ${url}</p>
                <p style="color: #666; font-size: 14px;">Link ini akan expire dalam 1 jam.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
            </div>
        `,
    });
}
