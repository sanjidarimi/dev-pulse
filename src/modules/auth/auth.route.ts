import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/", authController.createUser);
router.post("/",authController.getUser )
export const authRoute = router;
