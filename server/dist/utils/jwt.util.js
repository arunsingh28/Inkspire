"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtil = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.JWT_SECRET || "secret-key";
class JwtUtil {
    static generateToken(payload, options) {
        return jsonwebtoken_1.default.sign(payload, SECRET_KEY, options);
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
}
exports.JwtUtil = JwtUtil;
