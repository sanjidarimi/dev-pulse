import type { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/Response";
import { authService } from "./auth.service";

const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendSuccessResponse(res, 201, "user registed successfully", result);
  } catch (error) {
    next(error);
  }
};
export const authController = {
  createUser,
};
