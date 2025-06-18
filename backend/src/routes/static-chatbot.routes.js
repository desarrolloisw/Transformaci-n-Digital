/**
 * Static Chatbot routes
 *
 * This file defines the API endpoint for handling static chatbot messages.
 *
 * Routes:
 *   POST /static - Process a message with the static chatbot controller
 */

import { Router } from 'express';
import { staticChatbotController } from '../controllers/static-chatbot.controller.js';

const router = Router();

router.post('/static', staticChatbotController.handleMessage);

export default router;