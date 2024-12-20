import type { Response } from "express";

export function successResponse(
  res: Response,
  data: any,
  status = 200,
  message = "Success"
) {
  return res.status(status).json({ success: true, message, data });
}

export function errorResponse(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, error: message });
}
