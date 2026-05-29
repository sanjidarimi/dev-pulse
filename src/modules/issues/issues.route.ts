import { Router } from "express";
import { issuesController } from "./issues.controller";
import { protect } from "../../middlewares/auth.middleware";

const router = Router();
router.post("/",protect,issuesController.createIssue)

export const IssuesRoute = router
