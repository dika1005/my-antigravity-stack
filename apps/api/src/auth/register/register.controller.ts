import { Elysia, t } from "elysia";
import { registerService } from "./register.service";
import { success, error } from "@lib/response";

export const registerController = new Elysia({ prefix: "/register" })
    .post(
        "/",
        async ({ body, set }) => {
            const result = await registerService.register(
                body.email,
                body.password,
                body.name
            );

            if (!result.success) {
                set.status = 400;
                return error(result.message!);
            }

            set.status = 201;
            return success(null, result.message);
        },
        {
            body: t.Object({
                email: t.String({ format: "email" }),
                password: t.String({ minLength: 8 }),
                name: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Auth"],
                summary: "Register new user",
                description: "Creates a pending user and sends verification email",
            },
        }
    );
