import { Elysia, t } from "elysia";
import { logoutService } from "./logout.service";
import { success } from "@lib/response";

export const logoutController = new Elysia({ prefix: "/logout" })
    .post(
        "/",
        async ({ cookie }) => {
            const refreshTokenValue = cookie.refreshToken.value;

            if (refreshTokenValue) {
                await logoutService.logout(refreshTokenValue);
            }

            // Clear cookies
            cookie.accessToken.remove();
            cookie.refreshToken.remove();

            return success(null, "Logout berhasil");
        },
        {
            cookie: t.Cookie({
                accessToken: t.Optional(t.String()),
                refreshToken: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Auth"],
                summary: "Logout",
                description: "Clears auth cookies and revokes refresh token",
            },
        }
    );
