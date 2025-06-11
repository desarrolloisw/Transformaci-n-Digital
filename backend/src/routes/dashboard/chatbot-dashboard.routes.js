import { Router } from "express";
import {
  getFirstLogDateCtrl,
  getProcessCountCtrl,
  getCategoryCountCtrl,
  getCategoryCountByProcessCtrl,
  getTotalQuestionsCtrl,
  getTotalQuestionsByProcessCtrl
} from '../../controllers/dashboard/chatbot-dashboard.controller.js';

const router = Router();

// Fecha mínima del filtro
router.get('/logs/first-log-date', getFirstLogDateCtrl);
// Cantidad de preguntas por proceso
router.get('/logs/process-count', getProcessCountCtrl);
// Cantidad de preguntas por categoría
router.get('/logs/category-count', getCategoryCountCtrl);
// Cantidad de preguntas por categoría de un proceso (processId obligatorio)
router.get('/logs/category-count-by-process', getCategoryCountByProcessCtrl);
// Total de preguntas
router.get('/logs/total-questions', getTotalQuestionsCtrl);
// Total de preguntas de un proceso (processId obligatorio)
router.get('/logs/total-questions-by-process', getTotalQuestionsByProcessCtrl);

export default router;