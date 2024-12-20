import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/response.util";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err?.message);
  errorResponse(res, err?.message, 500);
}
