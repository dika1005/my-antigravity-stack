import { Elysia, t } from "elysia";
import { listService } from "./list.service";
import { paginate } from "@lib/response";

export const listController = new Elysia()
    .get(
        "/",
        async ({ query }) => {
            const result = await listService.list({
                page: query.page,
                limit: query.limit,
                categoryId: query.categoryId,
                search: query.search,
            });

            return paginate(
                result.galleries,
                result.pagination.page,
                result.pagination.limit,
                result.pagination.total
            );
        },
        {
            query: t.Object({
                page: t.Optional(t.Numeric({ minimum: 1 })),
                limit: t.Optional(t.Numeric({ minimum: 1, maximum: 50 })),
                categoryId: t.Optional(t.String()),
                search: t.Optional(t.String()),
            }),
            detail: {
                tags: ["Gallery"],
                summary: "List galleries",
                description: "Get paginated list of public galleries",
            },
        }
    );
