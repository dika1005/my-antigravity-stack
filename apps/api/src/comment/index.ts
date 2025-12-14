import { Elysia, t } from "elysia";
import { commentRepository } from "./comment.repository";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized, forbidden, paginate } from "@lib/response";

export const commentRoutes = new Elysia({ prefix: "/comment" })
    .get(
        "/gallery/:id",
        async ({ params, query }) => {
            const page = query.page || 1;
            const limit = Math.min(query.limit || 10, 50);

            const [comments, total] = await Promise.all([
                commentRepository.findByGallery(params.id, page, limit),
                commentRepository.countByGallery(params.id),
            ]);

            return paginate(comments, page, limit, total);
        },
        {
            params: t.Object({ id: t.String() }),
            query: t.Object({
                page: t.Optional(t.Numeric({ minimum: 1 })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
            }),
            detail: { tags: ["Comment"], summary: "Get gallery comments" },
        }
    )
    .use(authMiddleware)
    .post(
        "/gallery/:id",
        async ({ params, body, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const comment = await commentRepository.create({
                content: body.content,
                userId: user.id,
                galleryId: params.id,
                parentId: body.parentId,
            });

            set.status = 201;
            return success(comment, "Komentar berhasil ditambah");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            body: t.Object({
                content: t.String({ minLength: 1 }),
                parentId: t.Optional(t.String()),
            }),
            detail: { tags: ["Comment"], summary: "Add comment to gallery" },
        }
    )
    .delete(
        "/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const comment = await commentRepository.findById(params.id);
            if (!comment) { set.status = 404; return error("Komentar tidak ditemukan"); }
            if (comment.user.id !== user.id) { set.status = 403; return forbidden(); }

            await commentRepository.delete(params.id);
            return success(null, "Komentar berhasil dihapus");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Comment"], summary: "Delete comment" },
        }
    );
