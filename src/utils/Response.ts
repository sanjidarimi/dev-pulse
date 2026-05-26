import type { Response } from "express";

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = <T>(
  res: Response,
  message: string,
  statusCode: number,
  error?: T,
) :Response => {
  return res.status(statusCode).json({
    message,
    success: false,
    error: error !== undefined ? error : null,
  });
};
