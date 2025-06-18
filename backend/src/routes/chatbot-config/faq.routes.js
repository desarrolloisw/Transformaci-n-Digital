/**
 * FAQ management routes
 *
 * This file defines the API endpoints for managing chatbot FAQs, including creation, retrieval, response updates, and toggling active state.
 *
 * Routes:
 *   POST   /                      - Create a new FAQ (admin only)
 *   GET    /by-process-category   - Get FAQ by process and category (admin only)
 *   PUT    /update-response       - Update FAQ response (admin only)
 *   PUT    /toggle-active         - Toggle active state of a FAQ (admin only)
 */

import { Router } from 'express';
import {
  createFaqController,
  getFaqByProcessAndCategoryController,
  updateFaqResponseController,
  toggleFaqActiveController
} from '../../controllers/chatbot-config/faq.controller.js';
import { authenticateToken, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', authenticateToken, isPAT, createFaqController);
router.get('/by-process-category', authenticateToken, isPAT, getFaqByProcessAndCategoryController);
router.put('/update-response', authenticateToken, isPAT, updateFaqResponseController);
router.put('/toggle-active', authenticateToken, isPAT, toggleFaqActiveController);

export default router;
