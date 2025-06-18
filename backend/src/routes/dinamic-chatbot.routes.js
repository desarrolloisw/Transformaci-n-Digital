/**
 * Dynamic Chatbot routes
 *
 * This file defines the API endpoint for handling dynamic chatbot messages.
 *
 * Routes:
 *   POST /dinamic - Process a message with the dynamic chatbot controller
 */

import { Router } from 'express';
import { dinamicChatbotController } from '../controllers/dinamic-chatbot.controller.js';

const router = Router();

router.post('/dinamic', dinamicChatbotController.handleMessage);

export default router;
