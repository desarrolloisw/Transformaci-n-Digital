/**
 * Dynamic Chatbot AI Routes
 *
 * Defines the Express routes for handling dynamic chatbot AI requests.
 *
 * POST /dinamic/ai - Handles incoming messages for the dynamic chatbot powered by AI.
 *
 * Exports:
 *   - router: Express router with the /dinamic/ai POST endpoint
 */

import { Router } from 'express';
import { dinamicChatbotAIController } from '../controllers/dinamic-chatbot-ai.controller.js';

const router = Router();

// POST /dinamic/ai
// Handles a dynamic chatbot AI message request
router.post('/dinamic/ai', dinamicChatbotAIController.handleMessage);

export default router;