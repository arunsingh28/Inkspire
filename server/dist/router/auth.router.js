"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_validation_schema_1 = require("../schemas/auth.validation.schema");
class AuthRouter {
    _router;
    _controller;
    constructor() {
        this._router = (0, express_1.Router)();
        this._controller = new auth_controller_1.AuthController();
        this.routes();
    }
    routes() {
        this._router.post("/login", (0, validate_middleware_1.validatePayload)(auth_validation_schema_1.loginSchema), this._controller.login);
        this._router.post("/register", (0, validate_middleware_1.validatePayload)(auth_validation_schema_1.registerSchema), this._controller.register);
    }
    get router() {
        return this._router;
    }
}
exports.AuthRouter = AuthRouter;
