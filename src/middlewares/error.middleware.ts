import type { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/Response";
interface IError extends Error {
  statusCode?: number;
  error: unknown;
}
export const globalErrorHandler = (
  err: IError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";

sendErrorResponse(res, message, statusCode, err.error);};
