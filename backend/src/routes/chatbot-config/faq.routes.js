import { Router } from 'express';
import {
  createFaqController,
  getFaqByProcessAndCategoryController,
  updateFaqResponseController,
  toggleFaqActiveController
} from '../../controllers/chatbot-config/faq.controller.js';
import { authenticateToken } from '../../middlewares/auth.middleware.js';

const router = Router();

// Crear FAQ
router.post('/', authenticateToken, createFaqController);
// Obtener FAQ por proceso y categoría
router.get('/by-process-category', getFaqByProcessAndCategoryController);
// Modificar respuesta de FAQ
router.put('/update-response', authenticateToken, updateFaqResponseController);
// Toogle FAQ activa/inactiva
router.put('/toggle-active', authenticateToken, toggleFaqActiveController);

export default router;
