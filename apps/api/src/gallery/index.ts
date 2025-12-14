import { Elysia } from "elysia";
import { listController } from "./list/list.controller";
import { detailController } from "./detail/detail.controller";
import { createController } from "./create/create.controller";
import { updateController } from "./update/update.controller";
import { deleteController } from "./delete/delete.controller";

/**
 * Gallery Routes Aggregator
 * Combines all gallery-related routes under /gallery prefix
 */
export const galleryRoutes = new Elysia({ prefix: "/gallery" })
    .use(listController)    // GET /gallery
    .use(detailController)  // GET /gallery/:slug
    .use(createController)  // POST /gallery
    .use(updateController)  // PATCH /gallery/:id
    .use(deleteController); // DELETE /gallery/:id
