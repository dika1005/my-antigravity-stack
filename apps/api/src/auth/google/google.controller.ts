import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { googleService } from "./google.service";
import { success, error } from "@lib/response";

export const googleController = new Elysia({ prefix: "/google" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "your-super-secret-key",
            exp: "15m",
        })
    )
    // Redirect to Google OAuth
    .get(
        "/",
        ({ redirect }) => {
            const authUrl = googleService.getAuthUrl();
            return redirect(authUrl);
        },
        {
            detail: {
                tags: ["Auth"],
                summary: "Google OAuth Login",
                description: "Redirects to Google OAuth consent screen",
            },
        }
    )
    // Handle Google OAuth callback
    .get(
        "/callback",
        async ({ query, jwt, set, headers, cookie, redirect }) => {
            if (query.error) {
                // User cancelled or error occurred
                return redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_cancelled`);
            }

            if (!query.code) {
                set.status = 400;
                return error("Authorization code tidak ditemukan");
            }

            const result = await googleService.handleCallback(
                query.code,
                headers["user-agent"],
                headers["x-forwarded-for"] || undefined
            );

            if (!result.success) {
                return redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=google_failed`);
            }

            // Generate access token
            const token = await jwt.sign({
                sub: result.data!.user.id,
                email: result.data!.user.email,
                role: result.data!.user.role,
            });

            // Set access token in httpOnly cookie
            cookie.accessToken.set({
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60, // 15 minutes
                path: "/",
            });

            // Set refresh token in httpOnly cookie
            cookie.refreshToken.set({
                value: result.data!.refreshToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60, // 7 days
                path: "/",
            });

            // Redirect to frontend with success
            const redirectUrl = result.data!.isNewUser
                ? `${process.env.FRONTEND_URL || "http://localhost:3000"}/welcome`
                : `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard`;

            return redirect(redirectUrl);
        },
        {
            query: t.Object({
                code: t.Optional(t.String()),
                error: t.Optional(t.String()),
                state: t.Optional(t.String()),
            }),
            cookie: t.Cookie({
                accessToken: t.Optional(t.String()),
                refreshToken: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Auth"],
                summary: "Google OAuth Callback",
                description: "Handles callback from Google OAuth and sets auth cookies",
            },
        }
    );
