import { Elysia, t } from "elysia";
import { likeRepository } from "./like.repository";
import { authMiddleware } from "@middleware/auth";
import { success, error, unauthorized } from "@lib/response";

export const likeRoutes = new Elysia({ prefix: "/like" })
    .use(authMiddleware)
    .post(
        "/gallery/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await likeRepository.findByUserAndGallery(user.id, params.id);
            if (existing) {
                return error("Sudah di-like");
            }

            await likeRepository.likeGallery(user.id, params.id);
            const count = await likeRepository.countByGallery(params.id);
            return success({ liked: true, count }, "Berhasil like");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Like"], summary: "Like gallery" },
        }
    )
    .delete(
        "/gallery/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await likeRepository.findByUserAndGallery(user.id, params.id);
            if (!existing) {
                return error("Belum di-like");
            }

            await likeRepository.unlike(existing.id);
            const count = await likeRepository.countByGallery(params.id);
            return success({ liked: false, count }, "Berhasil unlike");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Like"], summary: "Unlike gallery" },
        }
    )
    .post(
        "/image/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await likeRepository.findByUserAndImage(user.id, params.id);
            if (existing) { return error("Sudah di-like"); }

            await likeRepository.likeImage(user.id, params.id);
            const count = await likeRepository.countByImage(params.id);
            return success({ liked: true, count }, "Berhasil like");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Like"], summary: "Like image" },
        }
    )
    .delete(
        "/image/:id",
        async ({ params, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const existing = await likeRepository.findByUserAndImage(user.id, params.id);
            if (!existing) { return error("Belum di-like"); }

            await likeRepository.unlike(existing.id);
            const count = await likeRepository.countByImage(params.id);
            return success({ liked: false, count }, "Berhasil unlike");
        },
        {
            requireAuth: true,
            params: t.Object({ id: t.String() }),
            detail: { tags: ["Like"], summary: "Unlike image" },
        }
    );
