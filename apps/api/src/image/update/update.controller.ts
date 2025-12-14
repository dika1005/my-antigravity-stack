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
                set.status = result.forbidden ? 403 : 404;
                return result.forbidden ? forbidden(result.message) : error(result.message);
            }

            return success(result.image, result.message);
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            body: t.Object({
                title: t.Optional(t.String()),
                description: t.Optional(t.String()),
            }),
            detail: { tags: ["Image"], summary: "Update image" },
        }
    );
