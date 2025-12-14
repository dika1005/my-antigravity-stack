import { Elysia, t } from "elysia";
import { tagRepository } from "./tag.repository";
import { authMiddleware } from "@middleware/auth";
import { success, unauthorized } from "@lib/response";

export const tagRoutes = new Elysia({ prefix: "/tag" })
    .get(
        "/",
        async () => {
            const tags = await tagRepository.findAll();
            return success(tags);
        },
        { detail: { tags: ["Tag"], summary: "List all tags" } }
    )
    .use(authMiddleware)
    .post(
        "/",
        async ({ body, user, set }) => {
            if (!user) { set.status = 401; return unauthorized(); }

            const tag = await tagRepository.findOrCreate(body.name);
            set.status = 201;
            return success(tag, "Tag berhasil dibuat");
        },
        {
            requireAuth: true,
            body: t.Object({ name: t.String({ minLength: 1 }) }),
            detail: { tags: ["Tag"], summary: "Create tag" },
        }
    );
