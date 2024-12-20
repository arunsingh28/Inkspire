import express from "express";
import cors from "cors";
import expressMongoSanitize from "express-mongo-sanitize";

import { AuthRouter } from "./router/auth.router";
import { PostRouter } from "./router/post.router";

import { errorHandler } from "./middlewares/error.middleware";

import { connectDB } from "./config/db";
import { authMiddleware } from "./middlewares/auth.middleware";

class App {
  private _app: express.Application;
  private _port: number;

  constructor() {
    this._app = express();
    this._port = (process.env.PORT as unknown as number) || 9211;
    // this._app.use(express.json())
    this.init();
    this.apis();
  }

  // middlewares
  private async init() {
    this._app.use(express.json());
    this._app.set("trust proxy", 1);
    this._app.use(cors());
    this._app.options("*", cors());
    this._app.use(expressMongoSanitize());
    await connectDB();
  }

  // apis
  private async apis() {
    const authRouter = new AuthRouter();
    const postRouter = new PostRouter();

    this._app.use("/auth", authRouter.router);
    this._app.use("/blog", postRouter.router);

    // Error handler middleware
    this._app.use(errorHandler);

    this._app.listen(this._port, () => {
      console.log(`Server running on port ${this._port}`);
    });
  }
}

// use app instance for futher sacling
new App();
