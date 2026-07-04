import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { sendErrorResponse } from "../utils/Response";

export interface IAuthUser {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("bearer ")) {
    sendErrorResponse(res, 401, "unauthorized", "missing token");
    return;
  }
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || !parts[1]) {
    sendErrorResponse(res, 401, "unauthorized", "missing token");
    return;
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secret!,
    ) as unknown as IAuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    sendErrorResponse(res, 401, "unauthorized", "invalid or expired token");
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendErrorResponse(res, 403, "Forbidden", "Insufficient permissions");
      return;
    }
    next();
  };
};
