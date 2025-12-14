import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";

/**
 * Auth Middleware Plugin
 * Provides JWT authentication for Elysia routes - reads from cookies
 */
export const authMiddleware = new Elysia({ name: "auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
            exp: "15m",
        })
    )
    .derive({ as: "global" }, async ({ jwt, cookie }) => {
        const token = cookie.accessToken?.value;

        if (!token || typeof token !== "string") {
            return { user: null };
        }

        try {
            const payload = await jwt.verify(token);

            if (!payload) return { user: null };

            return {
                user: {
                    id: payload.sub as string,
                    email: payload.email as string,
                    role: payload.role as string,
                },
            };
        } catch {
            return { user: null };
        }
    })
    .macro({
        /** Require authentication */
        requireAuth(enabled: boolean) {
            if (!enabled) return;
            return {
                beforeHandle({ user, set }) {
                    if (!user) {
                        set.status = 401;
                        return { success: false, message: "Unauthorized", error: "UNAUTHORIZED" };
                    }
                },
            };
        },
        /** Require admin role */
        requireAdmin(enabled: boolean) {
            if (!enabled) return;
            return {
                beforeHandle({ user, set }) {
                    if (!user) {
                        set.status = 401;
                        return { success: false, message: "Unauthorized", error: "UNAUTHORIZED" };
                    }
                    if (user.role !== "ADMIN") {
                        set.status = 403;
                        return { success: false, message: "Forbidden", error: "FORBIDDEN" };
                    }
                },
            };
        },
    });
