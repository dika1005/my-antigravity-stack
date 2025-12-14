import { Elysia } from "elysia";
import { uploadController } from "./upload/upload.controller";
import { updateController } from "./update/update.controller";
import { deleteController } from "./delete/delete.controller";

export const imageRoutes = new Elysia({ prefix: "/image" })
    .use(uploadController)
    .use(updateController)
    .use(deleteController);
