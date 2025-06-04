import { Router } from 'express';
import { staticChatbotController } from '../controllers/static-chatbot.controller.js';

const router = Router();

router.post('/static', staticChatbotController.handleMessage);

export default router;