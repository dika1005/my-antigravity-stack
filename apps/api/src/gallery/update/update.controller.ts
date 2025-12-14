import { Elysia, t } from "elysia";
import { updateService } from "./update.service";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized, forbidden } from "@lib/response";

export const updateController = new Elysia()
    .use(authMiddleware)
    .patch(
        "/:id",
        async ({ params, body, user, set }) => {
            if (!user) {
                set.status = 401;
                return unauthorized();
            }

            const result = await updateService.update(params.id, user.id, body);

            if (!result.success) {
                if (result.forbidden) {
                    set.status = 403;
                    return forbidden(result.message);
                }
                set.status = 404;
                return error(result.message);
            }

            return success(result.gallery, result.message);
        },
        {
            requireAuth: true,
            params: t.Object({
                id: t.String(),
            }),
            body: t.Object({
                title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
                description: t.Optional(t.String()),
                categoryId: t.Optional(t.String()),
                isPublic: t.Optional(t.Boolean()),
                coverImage: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Gallery"],
                summary: "Update gallery",
                description: "Update gallery (owner only)",
            },
        }
    );
