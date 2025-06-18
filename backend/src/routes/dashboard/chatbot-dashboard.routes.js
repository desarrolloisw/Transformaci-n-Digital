/**
 * Chatbot Dashboard routes
 *
 * This file defines the API endpoints for retrieving chatbot dashboard analytics and statistics.
 *
 * Routes:
 *   GET /logs/first-log-date            - Get the earliest log date (for filtering)
 *   GET /logs/process-count             - Get the number of questions per process
 *   GET /logs/category-count            - Get the number of questions per category
 *   GET /logs/category-count-by-process - Get the number of questions per category for a specific process (requires processId)
 *   GET /logs/total-questions           - Get the total number of questions
 *   GET /logs/total-questions-by-process- Get the total number of questions for a specific process (requires processId)
 */

import { Router } from "express";
import {
  getFirstLogDateCtrl,
  getProcessCountCtrl,
  getCategoryCountCtrl,
  getCategoryCountByProcessCtrl,
  getTotalQuestionsCtrl,
  getTotalQuestionsByProcessCtrl
} from '../../controllers/dashboard/chatbot-dashboard.controller.js';
import { authenticateToken, isAny } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/logs/first-log-date', authenticateToken, isAny, getFirstLogDateCtrl);
router.get('/logs/process-count', authenticateToken, isAny, getProcessCountCtrl);
router.get('/logs/category-count', authenticateToken, isAny, getCategoryCountCtrl);
router.get('/logs/category-count-by-process', authenticateToken, isAny, getCategoryCountByProcessCtrl);
router.get('/logs/total-questions', authenticateToken, isAny, getTotalQuestionsCtrl);
router.get('/logs/total-questions-by-process', authenticateToken, isAny, getTotalQuestionsByProcessCtrl);

export default router;