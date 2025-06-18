/**
 * Authentication routes
 *
 * This file defines the API endpoints for user authentication, including registration and login.
 *
 * Routes:
 *   POST /register - Register a new user (requires validation and authentication)
 *   POST /login    - Authenticate a user and return a token
 */

import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validateRegister, validateLogin, authenticateToken, isPAT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', validateRegister, authenticateToken, isPAT, register);
router.post('/login', validateLogin, login);

export default router;