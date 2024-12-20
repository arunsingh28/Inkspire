"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRouter = void 0;
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const blog_validation_schema_1 = require("../schemas/blog.validation.schema");
class PostRouter {
    _router;
    _controller;
    constructor() {
        this._router = (0, express_1.Router)();
        this._controller = new post_controller_1.PostController();
        this.routes();
    }
    routes() {
        this._router.post("/create", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validatePayload)(blog_validation_schema_1.createBlogSchema), this._controller.create);
        this._router.get("/list", this._controller.list);
        this._router.delete("/delete/:id", auth_middleware_1.authMiddleware, this._controller.delete);
        this._router.put("/update/:id", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validatePayload)(blog_validation_schema_1.createBlogSchema), this._controller.update);
        this._router.get("/get/:id", this._controller.get);
        // genrate presigned url
        this._router.post("/generate-presigned-url", auth_middleware_1.authMiddleware, (0, validate_middleware_1.validatePayload)(blog_validation_schema_1.presignedUrlSchema), this._controller.generatePresignedUrl);
    }
    get router() {
        return this._router;
    }
}
exports.PostRouter = PostRouter;
