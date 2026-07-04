import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/signup", authController.createUser);
router.get("/login",authController.getUser )
export const authRoute = router;
