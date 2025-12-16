import { prisma } from "@lib/prisma";
import { authRepository } from "../auth.repository";
import { generateToken } from "@lib/token";
import { hashPassword } from "@lib/password";

interface GoogleUserInfo {
    id: string;
    email: string;
    name: string;
    picture: string;
}

interface GoogleAuthResult {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
            role: string;
            name?: string | null;
            avatar?: string | null;
        };
        refreshToken: string;
        isNewUser: boolean;
    };
}

export const googleService = {
    /**
     * Get Google OAuth URL for redirect
     */
    getAuthUrl: (): string => {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:8080/api/auth/google/callback";

        const params = new URLSearchParams({
            client_id: clientId!,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "email profile",
            access_type: "offline",
            prompt: "consent",
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },

    /**
     * Exchange authorization code for tokens and get user info
     */
    handleCallback: async (
        code: string,
        userAgent?: string,
        ipAddress?: string
    ): Promise<GoogleAuthResult> => {
        try {
            // Exchange code for tokens
            const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    client_id: process.env.GOOGLE_CLIENT_ID!,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI || "http://localhost:8080/api/auth/google/callback",
                }),
            });

            if (!tokenResponse.ok) {
                const errorBody = await tokenResponse.text();
                console.error("Google token exchange failed:", {
                    status: tokenResponse.status,
                    statusText: tokenResponse.statusText,
                    body: errorBody,
                });
                return { success: false, message: "Gagal mendapatkan token dari Google" };
            }

            const tokens = await tokenResponse.json() as { access_token: string };

            // Get user info from Google
            const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${tokens.access_token}` },
            });

            if (!userResponse.ok) {
                return { success: false, message: "Gagal mendapatkan info user dari Google" };
            }

            const googleUser = await userResponse.json() as GoogleUserInfo;

            // Find or create user
            let user = await authRepository.findUserByEmail(googleUser.email);
            let isNewUser = false;

            if (!user) {
                // Create new user (no password needed for OAuth users)
                const randomPassword = await hashPassword(generateToken());
                user = await authRepository.createUser({
                    email: googleUser.email,
                    password: randomPassword,
                    name: googleUser.name,
                });

                // Update avatar if available
                if (googleUser.picture) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { avatar: googleUser.picture },
                    });
                    user.avatar = googleUser.picture;
                }

                isNewUser = true;
            }

            // Create refresh token
            const refreshToken = generateToken();
            const refreshExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            await authRepository.createRefreshToken({
                token: refreshToken,
                userId: user.id,
                expiresAt: refreshExpiry,
                deviceInfo: userAgent,
                ipAddress,
            });

            return {
                success: true,
                message: isNewUser ? "Registrasi dengan Google berhasil" : "Login dengan Google berhasil",
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name,
                        avatar: user.avatar,
                    },
                    refreshToken,
                    isNewUser,
                },
            };
        } catch (error) {
            console.error("Google OAuth error:", error);
            return { success: false, message: "Terjadi kesalahan saat login dengan Google" };
        }
    },
};
