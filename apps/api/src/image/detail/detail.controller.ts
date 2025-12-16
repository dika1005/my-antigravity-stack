import { Elysia, t } from "elysia";
import { detailService } from "./detail.service";
import { error } from "@lib/response";

export const detailController = new Elysia()
    .get(
        "/:id",
        async ({ params, set }) => {
            const result = await detailService.getImageDetail(params.id);

            if (!result.success) {
                set.status = 404;
                return error(result.error || "Image not found");
            }

            return result;
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            detail: {
                tags: ["Image"],
                summary: "Get image detail",
            },
        }
    )
    .get(
        "/:id/related",
        async ({ params, query, set }) => {
            const result = await detailService.getRelatedImages(
                params.id,
                query.limit
            );

            if (!result.success) {
                set.status = 404;
                return error(result.error || "Image not found");
            }

            return result;
        },
        {
            params: t.Object({
                id: t.String(),
            }),
            query: t.Object({
                limit: t.Optional(t.Numeric()),
            }),
            detail: {
                tags: ["Image"],
                summary: "Get related images",
            },
        }
    );

