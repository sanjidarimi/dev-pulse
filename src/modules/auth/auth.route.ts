import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/", authController.createUser);

export const authRoute = router;
