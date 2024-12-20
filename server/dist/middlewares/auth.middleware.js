"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_util_1 = require("../utils/jwt.util");
const response_util_1 = require("../utils/response.util");
const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.split("Bearer ")[1];
    if (!token) {
        (0, response_util_1.errorResponse)(res, "Unauthorized", 401);
    }
    try {
        const decoded = jwt_util_1.JwtUtil.verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authMiddleware = authMiddleware;
