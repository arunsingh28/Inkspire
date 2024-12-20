"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const response_util_1 = require("../utils/response.util");
const jwt_util_1 = require("../utils/jwt.util");
const user_model_1 = require("../models/user.model");
class AuthController {
    async login(req, res, next) {
        try {
            const cred_error = "Invalid credentials";
            const { email, password } = req.body;
            const user = await user_model_1.UserModel.findOne({ email });
            if (!user) {
                throw new Error(cred_error);
            }
            const isPasswordMatch = await user.comparePassword(password);
            if (!isPasswordMatch) {
                throw new Error(cred_error);
            }
            const token = jwt_util_1.JwtUtil.generateToken({ id: user._id, email }, {
                expiresIn: "2d", // 2 days
            });
            (0, response_util_1.successResponse)(res, {
                token,
                user: user.toObject({
                    transform: (doc, ret) => {
                        delete ret.password;
                        delete ret.__v;
                        delete ret.tokens;
                        delete ret.createdAt;
                        delete ret.updatedAt;
                        return ret;
                    },
                }),
            });
        }
        catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const user = new user_model_1.UserModel({ email, password, name });
            await user.save();
            (0, response_util_1.successResponse)(res, { message: "User registered successfully" }, 201);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
