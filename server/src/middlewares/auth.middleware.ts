import { Request, Response, NextFunction } from "express";

import { JwtUtil } from "../utils/jwt.util";
import { errorResponse } from "../utils/response.util";

interface IUser {
  id: string;
  email: string;
}

export interface CustomedRequest extends Request {
  user: IUser;
}

export const authMiddleware = async (
  req: CustomedRequest,
  res: Response,
  next: NextFunction
) : Promise<Response | void> => {
  const token = req.header("Authorization")?.split("Bearer ")[1];
  if (!token) {
    errorResponse(res, "Unauthorized", 401);
  }
  try {
    const decoded = JwtUtil.verifyToken(token!);
    req.user = decoded as IUser;
    next();
  } catch (error) {
    next(error);
  }
};


