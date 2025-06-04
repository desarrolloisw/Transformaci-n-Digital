import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", authMiddleware.validateRegister, authController.register);


export default router;