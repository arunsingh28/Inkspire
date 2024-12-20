import { Router, RequestHandler } from "express";

import { PostController } from "../controllers/post.controller";

import { validatePayload } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

import {
  createBlogSchema,
  presignedUrlSchema,
} from "../schemas/blog.validation.schema";

export class PostRouter {
  private _router: Router;
  private _controller: PostController;

  constructor() {
    this._router = Router();
    this._controller = new PostController();
    this.routes();
  }

  private routes() {
    this._router.post(
      "/create",
      authMiddleware as unknown as RequestHandler,
      validatePayload(createBlogSchema),
      this._controller.create as unknown as RequestHandler
    );
    this._router.get("/list", this._controller.list);
    this._router.delete(
      "/delete/:id",
      authMiddleware as unknown as RequestHandler,
      this._controller.delete as unknown as RequestHandler
    );
    this._router.put(
      "/update/:id",
      authMiddleware as unknown as RequestHandler,
      validatePayload(createBlogSchema),
      this._controller.update as unknown as RequestHandler
    );
    this._router.get("/get/:id", this._controller.get);

    // genrate presigned url
    this._router.post(
      "/generate-presigned-url",
      authMiddleware as unknown as RequestHandler,
      validatePayload(presignedUrlSchema),
      this._controller.generatePresignedUrl
    );
  }

  get router() {
    return this._router;
  }
}
