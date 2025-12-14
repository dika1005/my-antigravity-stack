import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

/**
 * Auth Middleware Plugin
 * Provides JWT authentication for Elysia routes
 */
export const authMiddleware = new Elysia({ name: "auth" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
            exp: "15m",
        })
    )
    .derive(async ({ jwt, headers }) => {
        const authHeader = headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return { user: null };
        }

        try {
            const token = authHeader.substring(7);
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
