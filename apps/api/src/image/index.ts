import { Elysia } from "elysia";
import { uploadController } from "./upload/upload.controller";
import { updateController } from "./update/update.controller";
import { deleteController } from "./delete/delete.controller";
import { detailController } from "./detail/detail.controller";

export const imageRoutes = new Elysia({ prefix: "/image" })
    .use(detailController)
    .use(uploadController)
    .use(updateController)
    .use(deleteController);
