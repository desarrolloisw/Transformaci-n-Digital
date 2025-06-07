import { Router } from 'express';
import {
  createFaqController,
  getFaqByProcessAndCategoryController,
  updateFaqResponseController,
  toggleFaqActiveController
} from '../../controllers/chatbot-config/faq.controller.js';
import { authenticateToken, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Crear FAQ
router.post('/', authenticateToken, isPAT, createFaqController);
// Obtener FAQ por proceso y categoría
router.get('/by-process-category', authenticateToken, isPAT, getFaqByProcessAndCategoryController);
// Modificar respuesta de FAQ
router.put('/update-response', authenticateToken, isPAT, updateFaqResponseController);
// Toogle FAQ activa/inactiva
router.put('/toggle-active', authenticateToken, isPAT, toggleFaqActiveController);

export default router;
