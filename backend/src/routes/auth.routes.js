import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin, authenticateToken, isPAT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validateRegister, authenticateToken, isPAT, register);
router.post('/login', validateLogin, login);


export default router;