import type { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/Response";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface IAuthUser {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }
  }
}
const protect = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization;
  if (!token) {
    sendErrorResponse(res, 401, "unauthorized", "missing token");
    return;
  }
  try {
   const decoded = jwt.verify(token, config.jwt_secret) as unknown as IAuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    sendErrorResponse(res, 401, "unauthorized", "invalid or expired token");
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendErrorResponse(res, 403, 'Forbidden', 'Insufficient permissions');
      return;
    }
    next();
  };
};