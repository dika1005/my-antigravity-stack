import { Elysia, t } from "elysia";
import { userRepository } from "./user.repository";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized, paginate } from "@lib/response";

export const userRoutes = new Elysia({ prefix: "/user" })
    .use(authMiddleware)
    .get(
        "/me",
        async ({ user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }
            const profile = await userRepository.findById(user.id);
            return success(profile);
        },
        { requireAuth: true, detail: { tags: ["User"], summary: "Get my profile" } }
    )
    .patch(
        "/me",
        async ({ user, body, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }
            const profile = await userRepository.update(user.id, body);
            return success(profile, "Profile berhasil diupdate");
        },
        {
            requireAuth: true,
            body: t.Object({
                name: t.Optional(t.String()),
                avatar: t.Optional(t.String()),
                bio: t.Optional(t.String()),
            }),
            detail: { tags: ["User"], summary: "Update my profile" },
        }
    )
    .get(
        "/:id",
        async ({ params, set }) => {
            const user = await userRepository.findByIdPublic(params.id);
            if (!user) {
                set.status = 404;
                return error("User tidak ditemukan");
            }
            return success(user);
        },
        {
            params: t.Object({ id: t.String() }),
            detail: { tags: ["User"], summary: "Get public user profile" },
        }
    )
    .get(
        "/:id/galleries",
        async ({ params, query, user }) => {
            const page = query.page || 1;
            const limit = Math.min(query.limit || 10, 50);

            const [galleries, total] = await Promise.all([
                userRepository.getGalleries(params.id, page, limit, user?.id),
                userRepository.countGalleries(params.id, user?.id),
            ]);

            return paginate(galleries, page, limit, total);
        },
        {
            params: t.Object({ id: t.String() }),
            query: t.Object({
                page: t.Optional(t.Numeric({ minimum: 1 })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
            }),
            detail: { tags: ["User"], summary: "Get user galleries" },
        }
    );
