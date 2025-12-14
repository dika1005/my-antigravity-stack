import { Elysia, t } from "elysia";
import { deleteService } from "./delete.service";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized, forbidden } from "@lib/response";

export const deleteController = new Elysia()
    .use(authMiddleware)
    .delete(
        "/:id",
        async ({ params, user, set }) => {
            if (!user) {
                set.status = 401;
                return unauthorized();
            }

            const result = await deleteService.delete(params.id, user.id);

            if (!result.success) {
                set.status = result.forbidden ? 403 : 404;
                return result.forbidden ? forbidden(result.message) : error(result.message);
            }

            return success(null, result.message);
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Image"], summary: "Delete image" },
        }
    );
