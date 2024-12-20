import { Router } from "express";

import { AuthController } from "../controllers/auth.controller";

import { validatePayload } from "../middlewares/validate.middleware";

import { loginSchema, registerSchema } from "../schemas/auth.validation.schema";

export class AuthRouter {
  private _router: Router;
  private _controller: AuthController;

  constructor() {
    this._router = Router();
    this._controller = new AuthController();
    this.routes();
  }

  private routes() {
    this._router.post(
      "/login",
      validatePayload(loginSchema),
      this._controller.login
    );
    this._router.post(
      "/register",
      validatePayload(registerSchema),
      this._controller.register
    );
  }

  get router() {
    return this._router;
  }
}
