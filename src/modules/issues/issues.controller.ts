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
    sendSuccessResponse(res, 201, "Issue created successfully", result);
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const filters = {
      sort: req.query.sort as string,
      type: req.query.type as string,
      status: req.query.status as string,
    };
    const result = await issuesService.getAllIssues(filters);
    sendSuccessResponse(res, 200, "Issues retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const result = await issuesService.getSingleIssue(id);
    sendSuccessResponse(res, 200, "Issue retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    const user = req.user as IAuthUser;
    const result = await issuesService.updateIssus(id, req.body, user);
    sendSuccessResponse(res, 200, "Issue updated successfully", result);
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    await issuesService.deleteIssues(id);

    sendSuccessResponse(res, 200, "Issue deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
