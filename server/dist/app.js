"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const auth_router_1 = require("./router/auth.router");
const post_router_1 = require("./router/post.router");
const error_middleware_1 = require("./middlewares/error.middleware");
const db_1 = require("./config/db");
class App {
    _app;
    _port;
    constructor() {
        this._app = (0, express_1.default)();
        this._port = process.env.PORT || 9211;
        // this._app.use(express.json())
        this.init();
        this.apis();
    }
    // middlewares
    async init() {
        this._app.use(express_1.default.json());
        this._app.set("trust proxy", 1);
        this._app.use((0, cors_1.default)());
        this._app.options("*", (0, cors_1.default)());
        this._app.use((0, express_mongo_sanitize_1.default)());
        await (0, db_1.connectDB)();
    }
    // apis
    async apis() {
        const authRouter = new auth_router_1.AuthRouter();
        const postRouter = new post_router_1.PostRouter();
        this._app.use("/auth", authRouter.router);
        this._app.use("/blog", postRouter.router);
        // Error handler middleware
        this._app.use(error_middleware_1.errorHandler);
        this._app.listen(this._port, () => {
            console.log(`Server running on port ${this._port}`);
        });
    }
}
// use app instance for futher sacling
new App();
