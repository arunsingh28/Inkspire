import type { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

import { errorResponse } from "../utils/response.util";

export const validatePayload =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorMessages: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        errorMessages[error.path[0]] = error.message;
      });
      res.status(400).json({
        success: false,
        error: errorMessages,
      } as T);
      return;
    }
    next();
  };
