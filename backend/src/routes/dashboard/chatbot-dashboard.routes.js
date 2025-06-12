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

// Fecha mínima del filtro
router.get('/logs/first-log-date', authenticateToken, isAny, getFirstLogDateCtrl);
// Cantidad de preguntas por proceso
router.get('/logs/process-count', authenticateToken, isAny, getProcessCountCtrl);
// Cantidad de preguntas por categoría
router.get('/logs/category-count', authenticateToken, isAny, getCategoryCountCtrl);
// Cantidad de preguntas por categoría de un proceso (processId obligatorio)
router.get('/logs/category-count-by-process', authenticateToken, isAny, getCategoryCountByProcessCtrl);
// Total de preguntas
router.get('/logs/total-questions', authenticateToken, isAny, getTotalQuestionsCtrl);
// Total de preguntas de un proceso (processId obligatorio)
router.get('/logs/total-questions-by-process', authenticateToken, isAny, getTotalQuestionsByProcessCtrl);

export default router;