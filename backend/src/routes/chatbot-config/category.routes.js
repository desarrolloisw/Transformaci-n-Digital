/**
 * Category management routes
 *
 * This file defines the API endpoints for managing chatbot categories, including CRUD operations, toggling active state, and process-based queries.
 *
 * Routes:
 *   GET    /                      - Get all categories (admin only)
 *   GET    /:id                   - Get a category by ID (admin only)
 *   POST   /                      - Create a new category (admin only)
 *   PUT    /:id                   - Update a category by ID (admin only)
 *   DELETE /:id                   - Delete a category by ID (admin only)
 *   PUT    /:id/toggle-active     - Toggle active state of a category (admin only)
 *   GET    /by-process/:processId - Get categories by process ID (admin only)
 *   GET    /not-in-process/:processId - Get categories not in a process (admin only)
 */

import { Router } from 'express';
import { getAllCategories, getCategory, createCategoryController, updateCategoryController, deleteCategoryController, toggleCategoryActiveController, getCategoriesByProcessController, getCategoriesNotInProcessController } from '../../controllers/chatbot-config/category.controller.js';
import { authenticateToken, isPAT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticateToken, isPAT, getAllCategories);
router.get('/:id', authenticateToken, isPAT, getCategory);
router.post('/', authenticateToken, isPAT, createCategoryController);
router.put('/:id', authenticateToken, isPAT, updateCategoryController);
router.delete('/:id', authenticateToken, isPAT, deleteCategoryController);
router.put('/:id/toggle-active', authenticateToken, isPAT, toggleCategoryActiveController);
router.get('/by-process/:processId', authenticateToken, isPAT, getCategoriesByProcessController);
router.get('/not-in-process/:processId', authenticateToken, isPAT, getCategoriesNotInProcessController);

export default router;
