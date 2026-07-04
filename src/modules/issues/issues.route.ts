import { Router } from "express";
import { protect, restrictTo } from "../../middlewares/auth.middleware";
import { issuesController } from "./issues.controller";

const router = Router();

router.post("/", protect, issuesController.createIssue);
router.get("/", issuesController.getAllIssues);
router.get("/:id", issuesController.getSingleIssue);
router.patch("/:id", protect, issuesController.updateIssue);
router.delete(
  "/:id",
  protect,
  restrictTo("maintainer"),
  issuesController.deleteIssue,
);

export const IssuesRoute = router;