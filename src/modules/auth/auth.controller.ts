import type { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../utils/Response";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    sendSuccessResponse(res, 201, "user registed successfully", result);
  } catch (error) {
    res
      .status(404)
      .json({ success: false, message: "user already exited", error: error });
  }
};
const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.getUserIntoDB(req.body);
    sendSuccessResponse(res, 200, "login successfully", result);
  } catch (error) {
    next(error);
  }
};
export const authController = {
  createUser,
  getUser,
};
