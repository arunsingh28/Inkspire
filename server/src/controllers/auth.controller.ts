import { Request, Response, NextFunction } from "express";

import { RegisterInput, LoginInput } from "../schemas/auth.validation.schema";

import { successResponse } from "../utils/response.util";
import { JwtUtil } from "../utils/jwt.util";

import { UserModel } from "../models/user.model";

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cred_error = "Invalid credentials";
      const { email, password } = req.body as LoginInput;

      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error(cred_error);
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        throw new Error(cred_error);
      }

      const token = JwtUtil.generateToken(
        { id: user._id as string, email },
        {
          expiresIn: "2d", // 2 days
        }
      );

      successResponse(res, {
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
    } catch (error) {
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, name } = req.body as RegisterInput;

      const user = new UserModel({ email, password, name });

      await user.save();

      successResponse(res, { message: "User registered successfully" }, 201);
    } catch (error) {
      next(error);
    }
  }
}
