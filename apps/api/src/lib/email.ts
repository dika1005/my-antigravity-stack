/**
 * Email Helper (Placeholder)
 * Ganti dengan implementasi Resend/Nodemailer/SendGrid
 */

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

/** Send email (placeholder - logs to console) */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
    // TODO: Implement dengan Resend/Nodemailer
    console.log("📧 Email:", options.to, "-", options.subject);
    return true;
}

/** Send verification email */
export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify?token=${token}`;
    return sendEmail({
        to: email,
        subject: "Verifikasi Email Anda",
        html: `<h1>Selamat Datang!</h1><p>Klik link berikut untuk verifikasi:</p><a href="${url}">Verifikasi Email</a>`,
    });
}

/** Send password reset email */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    const url = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    return sendEmail({
        to: email,
        subject: "Reset Password",
        html: `<h1>Reset Password</h1><p>Klik link berikut untuk reset password:</p><a href="${url}">Reset Password</a>`,
    });
}
