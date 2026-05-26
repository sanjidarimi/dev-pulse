import type { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.createUserIntoDB(req.body);
    res.status(201).json({
      massage: "users created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      massage: "users existed",
      error:error
    });
  }
};
export const authController = {
  createUser,
};
