import { Elysia, t } from "elysia";
import { detailService } from "./detail.service";
import { success, notFound } from "@lib/response";

export const detailController = new Elysia()
    .get(
        "/:slug",
        async ({ params, set }) => {
            const result = await detailService.getBySlug(params.slug);

            if (!result.success) {
                set.status = 404;
                return notFound("Gallery");
            }

            return success(result.gallery);
        },
        {
            params: t.Object({
                slug: t.String(),
            }),
            detail: {
                tags: ["Gallery"],
                summary: "Get gallery detail",
                description: "Get single gallery by slug with images",
            },
        }
    );
