import { Elysia, t } from "elysia";
import { bookmarkRepository } from "./bookmark.repository";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized, paginate } from "@lib/response";

export const bookmarkRoutes = new Elysia({ prefix: "/bookmark" })
    .use(authMiddleware)
    // List user's bookmarks
    .get(
        "/",
        async ({ user, query, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const page = query.page || 1;
            const limit = Math.min(query.limit || 20, 50);

            const result = await bookmarkRepository.findByUser(user.id, page, limit);
            return paginate(result.bookmarks, page, limit, result.total);
        },
        {
            requireAuth: true,
            query: t.Object({
                page: t.Optional(t.Numeric({ minimum: 1 })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
            }),
            detail: { tags: ["Bookmark"], summary: "List my bookmarks" },
        }
    )
    // Bookmark gallery
    .post(
        "/gallery/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndGallery(user.id, params.id);
            if (existing) {
                return error("Sudah di-bookmark");
            }

            await bookmarkRepository.bookmarkGallery(user.id, params.id);
            return success({ bookmarked: true }, "Berhasil bookmark");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Bookmark gallery" },
        }
    )
    // Remove gallery bookmark
    .delete(
        "/gallery/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndGallery(user.id, params.id);
            if (!existing) {
                return error("Belum di-bookmark");
            }

            await bookmarkRepository.remove(existing.id);
            return success({ bookmarked: false }, "Berhasil hapus bookmark");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Remove gallery bookmark" },
        }
    )
    // Bookmark image
    .post(
        "/image/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndImage(user.id, params.id);
            if (existing) {
                return error("Sudah di-bookmark");
            }

            await bookmarkRepository.bookmarkImage(user.id, params.id);
            return success({ bookmarked: true }, "Berhasil bookmark");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Bookmark image" },
        }
    )
    // Remove image bookmark
    .delete(
        "/image/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndImage(user.id, params.id);
            if (!existing) {
                return error("Belum di-bookmark");
            }

            await bookmarkRepository.remove(existing.id);
            return success({ bookmarked: false }, "Berhasil hapus bookmark");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Remove image bookmark" },
        }
    )
    // Check bookmark status for gallery
    .get(
        "/gallery/:id/status",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndGallery(user.id, params.id);
            return success({ bookmarked: !!existing });
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Check gallery bookmark status" },
        }
    )
    // Check bookmark status for image
    .get(
        "/image/:id/status",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await bookmarkRepository.findByUserAndImage(user.id, params.id);
            return success({ bookmarked: !!existing });
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Bookmark"], summary: "Check image bookmark status" },
        }
    );
