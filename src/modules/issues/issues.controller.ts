import type { NextFunction, Request, Response } from "express";
import type { IAuthUser } from "../../middlewares/auth.middleware";
import { sendSuccessResponse } from "../../utils/Response";
import { issuesService } from "./issues.service";

const createIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const reportedId = (req.user as IAuthUser).id;
    const result = await issuesService.createIssueIntoDB(req.body, reportedId);
    sendSuccessResponse(res,201, "Issue created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const issuesController = {
  createIssue,
};
