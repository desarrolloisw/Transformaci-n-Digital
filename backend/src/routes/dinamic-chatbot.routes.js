import { Router } from 'express';
import { dinamicChatbotController } from '../controllers/dinamic-chatbot.controller.js';

const router = Router();

router.post('/dinamic', dinamicChatbotController.handleMessage);

export default router;
