import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { refreshService } from "./refresh.service";
import { success, error } from "@lib/response";

export const refreshController = new Elysia({ prefix: "/refresh" })
    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET || "your-super-secret-key",
            exp: "15m",
        })
    )
    .post(
        "/",
        async ({ jwt, set, cookie }) => {
            // Get refresh token from cookie
            const refreshTokenValue = cookie.refreshToken.value;

            if (!refreshTokenValue) {
                set.status = 401;
                return error("Refresh token tidak ditemukan");
            }

            const result = await refreshService.refresh(refreshTokenValue);

            if (!result.success) {
                set.status = 401;
                return error(result.message);
            }

            // Generate new access token
            const token = await jwt.sign({
                sub: result.data!.user.id,
                email: result.data!.user.email,
                role: result.data!.user.role,
            });

            // Update access token cookie
            cookie.accessToken.set({
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60, // 15 minutes
                path: "/",
            });

            // Return user data for frontend
            return success({
                user: result.data!.user,
            }, result.message);
        },
        {
            cookie: t.Cookie({
                accessToken: t.Optional(t.String()),
                refreshToken: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Auth"],
                summary: "Refresh token",
                description: "Get new access token using refresh token from cookie",
            },
        }
    );
