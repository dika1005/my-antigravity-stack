import { Elysia, t } from "elysia";
import { verifyService } from "./verify.service";
import { success, error } from "@lib/response";

export const verifyController = new Elysia({ prefix: "/verify" })
    .post(
        "/",
        async ({ body, set }) => {
            const result = await verifyService.verifyEmail(body.token);

            if (!result.success) {
                set.status = 400;
                return error(result.message!);
            }

            return success(null, result.message);
        },
        {
            body: t.Object({
                token: t.String(),
            }),
            detail: {
                tags: ["Auth"],
                summary: "Verify email",
                description: "Verifies email using token from email link",
            },
        }
    );
